import { FastifyPluginAsync } from 'fastify'
import { z } from 'zod'

const CreateCodexSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
})

const CreateSymbolSchema = z.object({
  name: z.string().min(1),
  meaning: z.string(),
  category: z.enum(['awakening', 'wisdom', 'practice', 'community']),
  visualRepresentation: z.string().optional(),
})

const CreateRitualSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  frequency: z.enum(['daily', 'weekly', 'monthly', 'as-needed']),
  steps: z.array(z.object({
    instruction: z.string(),
    duration: z.number().optional(),
    required: z.boolean().default(true),
  })),
})

export const codexRoutes: FastifyPluginAsync = async (fastify) => {
  // Get all codices
  fastify.get('/', {
    schema: {
      tags: ['Codex'],
      summary: 'Get all codices',
    },
    preHandler: [fastify.authenticate],
  }, async () => {
    // Mock codices data - replace with real database query
    const codices = [
      {
        id: '1',
        title: 'The Developer\'s Path',
        description: 'A sacred codex for conscious software development practices',
        authorId: 'user1',
        status: 'active',
        symbols: 12,
        rituals: 8,
        reflections: 24,
        commandments: 5,
        forks: 23,
        collaborators: 15,
        createdAt: '2024-09-01T00:00:00Z',
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'Sacred Architecture',
        description: 'Principles for building conscious software systems',
        authorId: 'user2',
        status: 'active',
        symbols: 8,
        rituals: 5,
        reflections: 12,
        commandments: 7,
        forks: 11,
        collaborators: 8,
        createdAt: '2024-08-15T00:00:00Z',
        updatedAt: new Date().toISOString(),
      },
    ]
    
    return { codices }
  })

  // Get codex by ID
  fastify.get('/:id', {
    schema: {
      tags: ['Codex'],
      summary: 'Get codex by ID',
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
    
    // Mock codex lookup - replace with real database query
    const codex = {
      id,
      title: 'The Developer\'s Path',
      description: 'A sacred codex for conscious software development practices',
      authorId: 'user1',
      status: 'active',
      symbols: [
        {
          id: 's1',
          name: 'Code as Sacred Practice',
          meaning: 'Every line of code is written with intention and mindfulness',
          category: 'practice',
          usageCount: 42,
          createdAt: '2024-09-01T00:00:00Z',
        },
      ],
      rituals: [
        {
          id: 'r1',
          name: 'Daily Code Meditation',
          description: 'Start each coding session with 5 minutes of mindful breathing',
          frequency: 'daily',
          participantsCount: 127,
          completionRate: 0.78,
          steps: [
            { id: 'rs1', order: 1, instruction: 'Sit comfortably at your workstation', required: true },
            { id: 'rs2', order: 2, instruction: 'Take 10 deep breaths', duration: 60, required: true },
          ],
          createdAt: '2024-09-01T00:00:00Z',
        },
      ],
      reflections: [],
      commandments: [],
      forks: 23,
      collaborators: ['user1', 'user2', 'user3'],
      createdAt: '2024-09-01T00:00:00Z',
      updatedAt: new Date().toISOString(),
    }
    
    return { codex }
  })

  // Create new codex
  fastify.post('/', {
    schema: {
      tags: ['Codex'],
      summary: 'Create new codex',
      body: {
        type: 'object',
        properties: {
          title: { type: 'string', minLength: 1 },
          description: { type: 'string' },
        },
        required: ['title', 'description'],
      },
    },
    preHandler: [fastify.authenticate],
  }, async (request, reply) => {
    const { title, description } = CreateCodexSchema.parse(request.body)
    
    // Mock codex creation - replace with real database insertion
    const newCodex = {
      id: Date.now().toString(),
      title,
      description,
      authorId: request.user!.id,
      status: 'draft',
      symbols: [],
      rituals: [],
      reflections: [],
      commandments: [],
      forks: 0,
      collaborators: [request.user!.id],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    reply.status(201).send({ codex: newCodex })
  })

  // Fork codex
  fastify.post('/:id/fork', {
    schema: {
      tags: ['Codex'],
      summary: 'Fork codex',
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
    
    // Mock codex forking - replace with real fork logic
    const forkedCodex = {
      id: Date.now().toString(),
      title: 'Forked Codex',
      description: 'A fork of an existing codex',
      authorId: request.user!.id,
      parentId: id,
      status: 'draft',
      symbols: [],
      rituals: [],
      reflections: [],
      commandments: [],
      forks: 0,
      collaborators: [request.user!.id],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    reply.status(201).send({ codex: forkedCodex })
  })

  // Add symbol to codex
  fastify.post('/:id/symbols', {
    schema: {
      tags: ['Codex'],
      summary: 'Add symbol to codex',
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
          name: { type: 'string', minLength: 1 },
          meaning: { type: 'string' },
          category: { type: 'string', enum: ['awakening', 'wisdom', 'practice', 'community'] },
          visualRepresentation: { type: 'string' },
        },
        required: ['name', 'meaning', 'category'],
      },
    },
    preHandler: [fastify.authenticate],
  }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const { name, meaning, category, visualRepresentation } = CreateSymbolSchema.parse(request.body)
    
    // Mock symbol creation - replace with real database insertion
    const newSymbol = {
      id: Date.now().toString(),
      name,
      meaning,
      category,
      visualRepresentation,
      usageCount: 0,
      createdAt: new Date().toISOString(),
    }
    
    reply.status(201).send({ symbol: newSymbol })
  })

  // Add ritual to codex
  fastify.post('/:id/rituals', {
    schema: {
      tags: ['Codex'],
      summary: 'Add ritual to codex',
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
          name: { type: 'string', minLength: 1 },
          description: { type: 'string' },
          frequency: { type: 'string', enum: ['daily', 'weekly', 'monthly', 'as-needed'] },
          steps: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                instruction: { type: 'string' },
                duration: { type: 'number' },
                required: { type: 'boolean' },
              },
              required: ['instruction'],
            },
          },
        },
        required: ['name', 'description', 'frequency', 'steps'],
      },
    },
    preHandler: [fastify.authenticate],
  }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const { name, description, frequency, steps } = CreateRitualSchema.parse(request.body)
    
    // Mock ritual creation - replace with real database insertion
    const newRitual = {
      id: Date.now().toString(),
      name,
      description,
      frequency,
      steps: steps.map((step, index) => ({
        id: Date.now().toString() + index,
        order: index + 1,
        ...step,
      })),
      participantsCount: 0,
      completionRate: 0,
      createdAt: new Date().toISOString(),
    }
    
    reply.status(201).send({ ritual: newRitual })
  })

  // Get community codices
  fastify.get('/community', {
    schema: {
      tags: ['Codex'],
      summary: 'Get community codices',
    },
    preHandler: [fastify.authenticate],
  }, async () => {
    // Mock community data - replace with real database query
    const community = {
      totalCodexes: 147,
      totalSymbols: 1203,
      totalRituals: 567,
      activeMembers: 89,
      recentActivity: [
        {
          id: '1',
          type: 'codex_created',
          user: 'Alice',
          action: 'created codex "Mindful Testing"',
          timestamp: new Date().toISOString(),
        },
        {
          id: '2',
          type: 'symbol_added',
          user: 'Bob',
          action: 'added symbol "Conscious Refactoring"',
          timestamp: new Date().toISOString(),
        },
      ],
    }
    
    return { community }
  })
}