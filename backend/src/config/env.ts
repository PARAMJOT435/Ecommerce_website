import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  PORT: z.string().transform(Number).default('3001'),
  NODE_ENV: z.enum(['development', 'production']).default('development'),
})

type Env = z.infer<typeof envSchema>

let env: Env

try {
  env = envSchema.parse(process.env)
} catch (error) {
  console.error('Environment validation failed:', error)
  process.exit(1)
}

export default env
