import { FastifyPluginAsync } from 'fastify'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
})

export const authRoutes: FastifyPluginAsync = async (fastify) => {
  // Login
  fastify.post('/login', {
    schema: {
      tags: ['Auth'],
      summary: 'User login',
      body: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 },
        },
        required: ['email', 'password'],
      },
    },
  }, async (request, reply) => {
    const { email, password } = LoginSchema.parse(request.body)

    // Mock user authentication - replace with real database lookup
    const mockUsers = [
      {
        id: '1',
        email: 'demo@aiengines.dev',
        password: await bcrypt.hash('demo123', 10),
        name: 'Demo User',
        tier: 'individual',
      },
    ]

    const user = mockUsers.find(u => u.email === email)
    if (!user || !await bcrypt.compare(password, user.password)) {
      reply.status(401).send({ error: 'Invalid credentials' })
      return
    }

    const token = fastify.jwt.sign({
      id: user.id,
      email: user.email,
      name: user.name,
      tier: user.tier,
    })

    reply.send({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        tier: user.tier,
      },
    })
  })

  // Register
  fastify.post('/register', {
    schema: {
      tags: ['Auth'],
      summary: 'User registration',
      body: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 },
          name: { type: 'string', minLength: 2 },
        },
        required: ['email', 'password', 'name'],
      },
    },
  }, async (request, reply) => {
    const { email, password, name } = RegisterSchema.parse(request.body)

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Mock user creation - replace with real database insertion
    const newUser = {
      id: Date.now().toString(),
      email,
      name,
      tier: 'individual',
      password: hashedPassword,
    }

    const token = fastify.jwt.sign({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      tier: newUser.tier,
    })

    reply.status(201).send({
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        tier: newUser.tier,
      },
    })
  })

  // Get current user
  fastify.get('/me', {
    schema: {
      tags: ['Auth'],
      summary: 'Get current user',
    },
    preHandler: [fastify.authenticate],
  }, async (request) => {
    return { user: request.user }
  })

  // Logout
  fastify.post('/logout', {
    schema: {
      tags: ['Auth'],
      summary: 'User logout',
    },
    preHandler: [fastify.authenticate],
  }, async () => {
    return { message: 'Logged out successfully' }
  })
}