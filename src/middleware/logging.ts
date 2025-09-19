import { FastifyRequest, FastifyReply } from 'fastify'
import { env } from '../config/environment.js'

export const requestLoggingMiddleware = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const startTime = Date.now()
  
  // Log request
  request.log.info({
    method: request.method,
    url: request.url,
    userAgent: request.headers['user-agent'],
    ip: request.ip,
    requestId: request.id
  }, 'Incoming request')
  
  // Add response logging
  reply.raw.on('finish', () => {
    const duration = Date.now() - startTime
    
    request.log.info({
      method: request.method,
      url: request.url,
      statusCode: reply.statusCode,
      duration,
      requestId: request.id
    }, 'Request completed')
  })
}

export const errorLoggingMiddleware = (
  error: Error,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  // Log error with context
  request.log.error({
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack
    },
    method: request.method,
    url: request.url,
    requestId: request.id,
    ip: request.ip
  }, 'Request error')
  
  // Don't expose internal errors in production
  if (env.NODE_ENV === 'production') {
    reply.status(500).send({
      error: 'Internal Server Error',
      message: 'An internal error occurred',
      requestId: request.id
    })
  } else {
    reply.status(500).send({
      error: error.name,
      message: error.message,
      requestId: request.id,
      stack: error.stack
    })
  }
}