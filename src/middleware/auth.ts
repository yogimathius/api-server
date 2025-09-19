import { FastifyRequest, FastifyReply } from 'fastify'

export const authMiddleware = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const token = request.headers.authorization?.replace('Bearer ', '')
    
    if (!token) {
      reply.status(401).send({ error: 'No token provided' })
      return
    }

    const decoded = request.server.jwt.verify(token)
    request.user = decoded as any
  } catch (err) {
    reply.status(401).send({ error: 'Invalid token' })
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: typeof authMiddleware
  }
  
  interface FastifyRequest {
    user?: {
      id: string
      email: string
      name: string
      tier: string
    }
  }
}