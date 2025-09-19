import { FastifyPluginAsync } from 'fastify'
import { z } from 'zod'

const CreateProjectSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  repository: z.string().url().optional(),
  framework: z.string(),
})

export const projectRoutes: FastifyPluginAsync = async (fastify) => {
  // Get all projects
  fastify.get('/', {
    schema: {
      tags: ['Projects'],
      summary: 'Get all projects',
    },
    preHandler: [fastify.authenticate],
  }, async () => {
    // Mock projects data - replace with real database query
    const projects = [
      {
        id: 'proj1',
        name: 'AI Engines Dashboard',
        description: 'Web dashboard for AgentOps and Sacred Codex platforms',
        repository: 'https://github.com/example/ai-engines-dashboard',
        framework: 'React',
        status: 'active',
        tasksCount: 15,
        agents: ['1', '2'],
        createdAt: '2024-09-10T08:00:00Z',
      },
      {
        id: 'proj2',
        name: 'Protocol Implementation',
        description: 'Core sacred protocol implementation in TypeScript',
        framework: 'Node.js',
        status: 'active',
        tasksCount: 8,
        agents: ['2'],
        createdAt: '2024-09-05T14:00:00Z',
      },
    ]
    
    return { projects }
  })

  // Get project by ID
  fastify.get('/:id', {
    schema: {
      tags: ['Projects'],
      summary: 'Get project by ID',
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
    
    // Mock project lookup - replace with real database query
    const project = {
      id,
      name: 'Project ' + id,
      description: 'Project description',
      framework: 'React',
      status: 'active',
      tasksCount: 15,
      agents: ['1', '2'],
      createdAt: '2024-09-10T08:00:00Z',
    }
    
    return { project }
  })

  // Create new project
  fastify.post('/', {
    schema: {
      tags: ['Projects'],
      summary: 'Create new project',
      body: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 1 },
          description: { type: 'string' },
          repository: { type: 'string', format: 'uri' },
          framework: { type: 'string' },
        },
        required: ['name', 'description', 'framework'],
      },
    },
    preHandler: [fastify.authenticate],
  }, async (request, reply) => {
    const { name, description, repository, framework } = CreateProjectSchema.parse(request.body)
    
    // Mock project creation - replace with real database insertion
    const newProject = {
      id: Date.now().toString(),
      name,
      description,
      repository,
      framework,
      status: 'active',
      tasksCount: 0,
      agents: [],
      createdAt: new Date().toISOString(),
    }
    
    reply.status(201).send({ project: newProject })
  })

  // Get project tasks
  fastify.get('/:id/tasks', {
    schema: {
      tags: ['Projects'],
      summary: 'Get project tasks',
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
    
    // Mock project tasks - replace with real database query
    const tasks = [
      {
        id: '1',
        title: 'Setup React TypeScript Project',
        description: 'Initialize a new React project with TypeScript configuration',
        type: 'scaffold',
        status: 'running',
        agentId: '1',
        projectId: id,
        progress: 75,
        createdAt: '2024-09-12T10:00:00Z',
      },
    ]
    
    return { tasks }
  })

  // Get project analytics
  fastify.get('/:id/analytics', {
    schema: {
      tags: ['Projects'],
      summary: 'Get project analytics',
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
    
    // Mock analytics data - replace with real analytics
    const analytics = {
      projectId: id,
      timeRange: '30d',
      data: {
        totalTasks: 47,
        completedTasks: 42,
        successRate: 0.89,
        averageTaskDuration: 15.2,
        activeAgents: 3,
        dailyActivity: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          tasks: Math.floor(Math.random() * 10),
          success: Math.floor(Math.random() * 10),
        })),
      },
    }
    
    return { analytics }
  })
}