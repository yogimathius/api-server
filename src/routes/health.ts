import { FastifyInstance } from 'fastify'
import { env } from '../config/environment.js'

interface HealthCheck {
  status: 'healthy' | 'unhealthy' | 'degraded'
  timestamp: string
  version: string
  environment: string
  uptime: number
  checks: {
    database: HealthStatus
    redis?: HealthStatus
    memory: HealthStatus
    disk: HealthStatus
  }
}

interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'degraded'
  responseTime?: number
  error?: string
  details?: Record<string, any>
}

export async function healthRoutes(fastify: FastifyInstance) {
  // Basic health check (fast)
  fastify.get('/health', async (request, reply) => {
    reply.send({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '0.1.0'
    })
  })
  
  // Detailed health check (slower, includes dependencies)
  fastify.get('/health/detailed', async (request, reply) => {
    const startTime = Date.now()
    
    const healthCheck: HealthCheck = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '0.1.0',
      environment: env.NODE_ENV,
      uptime: process.uptime(),
      checks: {
        database: await checkDatabase(),
        memory: checkMemory(),
        disk: checkDisk()
      }
    }
    
    // Add Redis check if configured
    if (env.REDIS_URL) {
      healthCheck.checks.redis = await checkRedis()
    }
    
    // Determine overall status
    const statuses = Object.values(healthCheck.checks).map(check => check.status)
    if (statuses.some(status => status === 'unhealthy')) {
      healthCheck.status = 'unhealthy'
      reply.status(503)
    } else if (statuses.some(status => status === 'degraded')) {
      healthCheck.status = 'degraded'
      reply.status(200)
    }
    
    const responseTime = Date.now() - startTime
    reply.header('X-Response-Time', `${responseTime}ms`)
    reply.send(healthCheck)
  })
  
  // Liveness probe (for Kubernetes)
  fastify.get('/health/live', async (request, reply) => {
    reply.send({ status: 'alive' })
  })
  
  // Readiness probe (for Kubernetes)
  fastify.get('/health/ready', async (request, reply) => {
    try {
      // Check critical dependencies
      const dbCheck = await checkDatabase()
      
      if (dbCheck.status === 'unhealthy') {
        reply.status(503).send({
          status: 'not ready',
          reason: 'database unhealthy'
        })
        return
      }
      
      reply.send({ status: 'ready' })
    } catch (error) {
      reply.status(503).send({
        status: 'not ready',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  })
}

async function checkDatabase(): Promise<HealthStatus> {
  const startTime = Date.now()
  
  try {
    // Simple database check - you might want to use your actual DB client here
    // For now, we'll simulate a check
    await new Promise(resolve => setTimeout(resolve, 10)) // Simulate DB query
    
    return {
      status: 'healthy',
      responseTime: Date.now() - startTime,
      details: {
        connection: 'active'
      }
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      responseTime: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Database connection failed'
    }
  }
}

async function checkRedis(): Promise<HealthStatus> {
  const startTime = Date.now()
  
  try {
    // Redis check - implement with your Redis client
    await new Promise(resolve => setTimeout(resolve, 5)) // Simulate Redis ping
    
    return {
      status: 'healthy',
      responseTime: Date.now() - startTime,
      details: {
        connection: 'active'
      }
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      responseTime: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Redis connection failed'
    }
  }
}

function checkMemory(): HealthStatus {
  const memUsage = process.memoryUsage()
  const totalMemory = memUsage.heapTotal
  const usedMemory = memUsage.heapUsed
  const memoryUsagePercent = (usedMemory / totalMemory) * 100
  
  let status: HealthStatus['status'] = 'healthy'
  if (memoryUsagePercent > 90) {
    status = 'unhealthy'
  } else if (memoryUsagePercent > 75) {
    status = 'degraded'
  }
  
  return {
    status,
    details: {
      heapUsed: Math.round(usedMemory / 1024 / 1024) + 'MB',
      heapTotal: Math.round(totalMemory / 1024 / 1024) + 'MB',
      usagePercent: Math.round(memoryUsagePercent)
    }
  }
}

function checkDisk(): HealthStatus {
  // Simple disk check - in production you might want to check actual disk usage
  return {
    status: 'healthy',
    details: {
      message: 'Disk space monitoring not implemented'
    }
  }
}