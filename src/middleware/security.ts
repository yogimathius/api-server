import { FastifyRequest, FastifyReply } from 'fastify'
import { env } from '../config/environment.js'

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export const rateLimitMiddleware = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const clientIp = request.ip
  const currentTime = Date.now()
  const windowMs = env.API_RATE_WINDOW * 60 * 1000 // Convert minutes to milliseconds
  
  // Clean up expired entries
  for (const [ip, data] of rateLimitStore.entries()) {
    if (currentTime > data.resetTime) {
      rateLimitStore.delete(ip)
    }
  }
  
  // Get or create client data
  let clientData = rateLimitStore.get(clientIp)
  if (!clientData || currentTime > clientData.resetTime) {
    clientData = {
      count: 0,
      resetTime: currentTime + windowMs
    }
    rateLimitStore.set(clientIp, clientData)
  }
  
  // Increment request count
  clientData.count++
  
  // Check if limit exceeded
  if (clientData.count > env.API_RATE_LIMIT) {
    reply.status(429).send({
      error: 'Too Many Requests',
      message: `Rate limit exceeded. Try again in ${Math.ceil((clientData.resetTime - currentTime) / 1000)} seconds.`,
      retryAfter: Math.ceil((clientData.resetTime - currentTime) / 1000)
    })
    return
  }
  
  // Add rate limit headers
  reply.header('X-RateLimit-Limit', env.API_RATE_LIMIT)
  reply.header('X-RateLimit-Remaining', env.API_RATE_LIMIT - clientData.count)
  reply.header('X-RateLimit-Reset', Math.ceil(clientData.resetTime / 1000))
}

export const requestValidationMiddleware = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  // Validate request size
  const contentLength = request.headers['content-length']
  if (contentLength && parseInt(contentLength) > 10 * 1024 * 1024) { // 10MB limit
    reply.status(413).send({
      error: 'Payload Too Large',
      message: 'Request body exceeds maximum size of 10MB'
    })
    return
  }
  
  // Validate content type for POST/PUT requests
  if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
    const contentType = request.headers['content-type']
    if (contentType && !contentType.includes('application/json')) {
      reply.status(415).send({
        error: 'Unsupported Media Type',
        message: 'Content-Type must be application/json'
      })
      return
    }
  }
}

export const securityHeadersMiddleware = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  // Security headers
  reply.header('X-Frame-Options', 'DENY')
  reply.header('X-Content-Type-Options', 'nosniff')
  reply.header('X-XSS-Protection', '1; mode=block')
  reply.header('Referrer-Policy', 'strict-origin-when-cross-origin')
  reply.header('X-Download-Options', 'noopen')
  reply.header('X-Permitted-Cross-Domain-Policies', 'none')
  
  // Remove server signature
  reply.removeHeader('X-Powered-By')
  
  // CSP for API (restrictive)
  reply.header('Content-Security-Policy', "default-src 'none'; frame-ancestors 'none';")
}