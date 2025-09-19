import { FastifyPluginAsync } from 'fastify'
import { z } from 'zod'

const CreateAgentSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['architect', 'engineer', 'tester', 'custom']),
  config: z.object({}).passthrough().optional(),
})

export const agentRoutes: FastifyPluginAsync = async (fastify) => {
  // Get all agents
  fastify.get('/', {
    schema: {
      tags: ['Agents'],
      summary: 'Get all agents',
    },
    preHandler: [fastify.authenticate],
  }, async () => {
    // Mock agents data - replace with real database query
    const agents = [
      {
        id: '1',
        name: 'Architect Alpha',
        type: 'architect',
        status: 'active',
        performance: {
          tasksCompleted: 47,
          successRate: 0.94,
          averageExecutionTime: 12.3,
          uptime: 0.98,
        },
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Engineer Beta',
        type: 'engineer',
        status: 'active',
        performance: {
          tasksCompleted: 89,
          successRate: 0.91,
          averageExecutionTime: 8.7,
          uptime: 0.97,
        },
        createdAt: '2024-01-20T14:30:00Z',
        updatedAt: new Date().toISOString(),
      },
    ]
    
    return { agents }
  })

  // Get agent by ID
  fastify.get('/:id', {
    schema: {
      tags: ['Agents'],
      summary: 'Get agent by ID',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
        required: ['id'],
      },
    },
    preHandler: [fastify.authenticate],
  }, async (request) => {
    const { id } = request.params as { id: string }
    
    // Mock agent lookup - replace with real database query
    const agent = {
      id,
      name: 'Agent ' + id,
      type: 'engineer',
      status: 'active',
      performance: {
        tasksCompleted: 47,
        successRate: 0.94,
        averageExecutionTime: 12.3,
        uptime: 0.98,
      },
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: new Date().toISOString(),
    }
    
    return { agent }
  })

  // Create new agent
  fastify.post('/', {
    schema: {
      tags: ['Agents'],
      summary: 'Create new agent',
      body: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 1 },
          type: { type: 'string', enum: ['architect', 'engineer', 'tester', 'custom'] },
          config: { type: 'object' },
        },
        required: ['name', 'type'],
      },
    },
    preHandler: [fastify.authenticate],
  }, async (request, reply) => {
    const { name, type, config } = CreateAgentSchema.parse(request.body)
    
    // Mock agent creation - replace with real database insertion
    const newAgent = {
      id: Date.now().toString(),
      name,
      type,
      status: 'idle',
      performance: {
        tasksCompleted: 0,
        successRate: 0,
        averageExecutionTime: 0,
        uptime: 1.0,
      },
      config: config || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    reply.status(201).send({ agent: newAgent })
  })

  // Update agent
  fastify.put('/:id', {
    schema: {
      tags: ['Agents'],
      summary: 'Update agent',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
        required: ['id'],
      },
    },
    preHandler: [fastify.authenticate],
  }, async (request) => {
    const { id } = request.params as { id: string }
    
    // Mock agent update - replace with real database update
    const updatedAgent = {
      id,
      name: 'Updated Agent ' + id,
      type: 'engineer',
      status: 'active',
      performance: {
        tasksCompleted: 47,
        successRate: 0.94,
        averageExecutionTime: 12.3,
        uptime: 0.98,
      },
      updatedAt: new Date().toISOString(),
    }
    
    return { agent: updatedAgent }
  })

  // Delete agent
  fastify.delete('/:id', {
    schema: {
      tags: ['Agents'],
      summary: 'Delete agent',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
        required: ['id'],
      },
    },
    preHandler: [fastify.authenticate],
  }, async (request, reply) => {
    const { id } = request.params as { id: string }
    
    // Mock agent deletion - replace with real database deletion
    reply.status(204).send()
  })

  // Get agent performance metrics
  fastify.get('/:id/metrics', {
    schema: {
      tags: ['Agents'],
      summary: 'Get agent performance metrics',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
        required: ['id'],
      },
    },
    preHandler: [fastify.authenticate],
  }, async (request) => {
    const { id } = request.params as { id: string }
    
    // Mock metrics data - replace with real analytics
    const metrics = {
      agentId: id,
      timeRange: '24h',
      data: {
        tasksCompleted: 47,
        successRate: 0.94,
        averageExecutionTime: 12.3,
        uptime: 0.98,
        hourlyActivity: Array.from({ length: 24 }, (_, i) => ({
          hour: i,
          tasks: Math.floor(Math.random() * 5),
          success: Math.floor(Math.random() * 5),
        })),
      },
    }
    
    return { metrics }
  })
}