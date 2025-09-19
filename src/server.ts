import fastify from 'fastify'
import cors from '@fastify/cors'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import websocket from '@fastify/websocket'
import jwt from '@fastify/jwt'
import dotenv from 'dotenv'

import { authRoutes } from './routes/auth.js'
import { agentRoutes } from './routes/agents.js'
import { taskRoutes } from './routes/tasks.js'
import { projectRoutes } from './routes/projects.js'
import { codexRoutes } from './routes/codex.js'
import { websocketHandler } from './services/websocket.js'
import { authMiddleware } from './middleware/auth.js'

dotenv.config()

const server = fastify({ logger: true })

// Register plugins
await server.register(cors, {
  origin: process.env.NODE_ENV === 'development' ? true : ['https://aiengines.dev'],
  credentials: true,
})

await server.register(jwt, {
  secret: process.env.JWT_SECRET || 'fallback-secret',
})

await server.register(swagger, {
  swagger: {
    info: {
      title: 'AI Engines Platform API',
      description: 'API for AgentOps and Sacred Codex platforms',
      version: '0.1.0',
    },
    host: 'localhost:3001',
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Agents', description: 'Agent management endpoints' },
      { name: 'Tasks', description: 'Task execution endpoints' },
      { name: 'Projects', description: 'Project management endpoints' },
      { name: 'Codex', description: 'Sacred Codex endpoints' },
    ],
  },
})

await server.register(swaggerUi, {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false,
  },
})

await server.register(websocket)

// WebSocket handler
server.register(websocketHandler)

// Auth middleware decorator
server.decorate('authenticate', authMiddleware)

// Health check
server.get('/health', async () => ({
  status: 'ok',
  timestamp: new Date().toISOString(),
  version: '0.1.0',
}))

// Register routes
await server.register(authRoutes, { prefix: '/api/auth' })
await server.register(agentRoutes, { prefix: '/api/agents' })
await server.register(taskRoutes, { prefix: '/api/tasks' })
await server.register(projectRoutes, { prefix: '/api/projects' })
await server.register(codexRoutes, { prefix: '/api/codex' })

// Start server
const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '3001')
    await server.listen({ port, host: '0.0.0.0' })
    console.log(`🚀 AI Engines API server running at http://localhost:${port}`)
    console.log(`📚 API docs available at http://localhost:${port}/docs`)
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()