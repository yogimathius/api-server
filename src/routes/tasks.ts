import { FastifyPluginAsync } from 'fastify'
import { z } from 'zod'

const CreateTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  type: z.enum(['scaffold', 'code-generation', 'testing', 'deployment', 'custom']),
  agentId: z.string(),
  projectId: z.string(),
  config: z.object({}).passthrough().optional(),
})

export const taskRoutes: FastifyPluginAsync = async (fastify) => {
  // Get all tasks
  fastify.get('/', {
    schema: {
      tags: ['Tasks'],
      summary: 'Get all tasks',
      querystring: {
        type: 'object',
        properties: {
          status: { type: 'string', enum: ['pending', 'running', 'completed', 'failed', 'cancelled'] },
          agentId: { type: 'string' },
          projectId: { type: 'string' },
          limit: { type: 'number', minimum: 1, maximum: 100, default: 20 },
          offset: { type: 'number', minimum: 0, default: 0 },
        },
      },
    },
    preHandler: [fastify.authenticate],
  }, async (request) => {
    const query = request.query as any
    
    // Mock tasks data - replace with real database query
    const tasks = [
      {
        id: '1',
        title: 'Setup React TypeScript Project',
        description: 'Initialize a new React project with TypeScript configuration',
        type: 'scaffold',
        status: 'running',
        agentId: '1',
        projectId: 'proj1',
        progress: 75,
        logs: [
          { id: '1', timestamp: new Date().toISOString(), level: 'info', message: 'Creating project structure...' },
          { id: '2', timestamp: new Date().toISOString(), level: 'info', message: 'Installing dependencies...' },
        ],
        createdAt: '2024-09-12T10:00:00Z',
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'Generate API Client',
        description: 'Create TypeScript client for REST API endpoints',
        type: 'code-generation',
        status: 'completed',
        agentId: '2',
        projectId: 'proj1',
        progress: 100,
        logs: [
          { id: '3', timestamp: new Date().toISOString(), level: 'info', message: 'Generated client interfaces' },
          { id: '4', timestamp: new Date().toISOString(), level: 'info', message: 'Added error handling' },
        ],
        createdAt: '2024-09-12T09:30:00Z',
        updatedAt: new Date().toISOString(),
        completedAt: '2024-09-12T10:45:00Z',
      },
    ]
    
    return { 
      tasks,
      pagination: {
        total: tasks.length,
        limit: query.limit || 20,
        offset: query.offset || 0,
      },
    }
  })

  // Get task by ID
  fastify.get('/:id', {
    schema: {
      tags: ['Tasks'],
      summary: 'Get task by ID',
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
    
    // Mock task lookup - replace with real database query
    const task = {
      id,
      title: 'Task ' + id,
      description: 'Task description',
      type: 'code-generation',
      status: 'running',
      agentId: '1',
      projectId: 'proj1',
      progress: 50,
      logs: [],
      createdAt: '2024-09-12T10:00:00Z',
      updatedAt: new Date().toISOString(),
    }
    
    return { task }
  })

  // Create new task
  fastify.post('/', {
    schema: {
      tags: ['Tasks'],
      summary: 'Create new task',
      body: {
        type: 'object',
        properties: {
          title: { type: 'string', minLength: 1 },
          description: { type: 'string' },
          type: { type: 'string', enum: ['scaffold', 'code-generation', 'testing', 'deployment', 'custom'] },
          agentId: { type: 'string' },
          projectId: { type: 'string' },
          config: { type: 'object' },
        },
        required: ['title', 'description', 'type', 'agentId', 'projectId'],
      },
    },
    preHandler: [fastify.authenticate],
  }, async (request, reply) => {
    const { title, description, type, agentId, projectId, config } = CreateTaskSchema.parse(request.body)
    
    // Mock task creation - replace with real database insertion
    const newTask = {
      id: Date.now().toString(),
      title,
      description,
      type,
      status: 'pending',
      agentId,
      projectId,
      progress: 0,
      logs: [],
      config: config || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    reply.status(201).send({ task: newTask })
  })

  // Update task status
  fastify.put('/:id/status', {
    schema: {
      tags: ['Tasks'],
      summary: 'Update task status',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
        required: ['id'],
      },
      body: {
        type: 'object',
        properties: {
          status: { type: 'string', enum: ['pending', 'running', 'completed', 'failed', 'cancelled'] },
          progress: { type: 'number', minimum: 0, maximum: 100 },
        },
        required: ['status'],
      },
    },
    preHandler: [fastify.authenticate],
  }, async (request) => {
    const { id } = request.params as { id: string }
    const { status, progress } = request.body as { status: string; progress?: number }
    
    // Mock task update - replace with real database update
    const updatedTask = {
      id,
      status,
      progress: progress || 0,
      updatedAt: new Date().toISOString(),
    }
    
    return { task: updatedTask }
  })

  // Cancel task
  fastify.post('/:id/cancel', {
    schema: {
      tags: ['Tasks'],
      summary: 'Cancel task',
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
    
    // Mock task cancellation - replace with real cancellation logic
    const cancelledTask = {
      id,
      status: 'cancelled',
      updatedAt: new Date().toISOString(),
    }
    
    return { task: cancelledTask }
  })

  // Get task logs
  fastify.get('/:id/logs', {
    schema: {
      tags: ['Tasks'],
      summary: 'Get task logs',
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
    
    // Mock logs - replace with real log retrieval
    const logs = [
      { id: '1', timestamp: new Date().toISOString(), level: 'info', message: 'Task started' },
      { id: '2', timestamp: new Date().toISOString(), level: 'info', message: 'Initializing workspace...' },
      { id: '3', timestamp: new Date().toISOString(), level: 'info', message: 'Processing configuration...' },
    ]
    
    return { logs }
  })
}