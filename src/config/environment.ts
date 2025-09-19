import { z } from 'zod'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Environment variable schema with validation
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).pipe(z.number().min(1).max(65535)).default('3001'),
  HOST: z.string().default('0.0.0.0'),
  
  // Database
  DATABASE_URL: z.string().min(1, 'Database URL is required'),
  
  // JWT
  JWT_SECRET: z.string().min(32, 'JWT secret must be at least 32 characters'),
  
  // Redis (optional)
  REDIS_URL: z.string().optional(),
  REDIS_PASSWORD: z.string().optional(),
  
  // Security
  CORS_ORIGINS: z.string().optional(),
  API_RATE_LIMIT: z.string().transform(Number).pipe(z.number().positive()).default('100'),
  API_RATE_WINDOW: z.string().transform(Number).pipe(z.number().positive()).default('15'),
  
  // Monitoring
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  SENTRY_DSN: z.string().optional(),
  
  // Health Check
  HEALTH_CHECK_TIMEOUT: z.string().transform(Number).pipe(z.number().positive()).default('5000'),
  SHUTDOWN_TIMEOUT: z.string().transform(Number).pipe(z.number().positive()).default('30000'),
})

export type Environment = z.infer<typeof envSchema>

// Validate and export environment
export const env = envSchema.parse(process.env)

// Helper functions
export const isDevelopment = () => env.NODE_ENV === 'development'
export const isProduction = () => env.NODE_ENV === 'production'
export const isTest = () => env.NODE_ENV === 'test'

// CORS origins parsing
export const getCorsOrigins = (): string[] | boolean => {
  if (!env.CORS_ORIGINS) {
    return isDevelopment() ? true : false
  }
  return env.CORS_ORIGINS.split(',').map(origin => origin.trim())
}