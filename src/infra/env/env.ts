import { z } from 'zod'

export const envShema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().optional().default(3333),
  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),
  JWT_REFRESH_PRIVATE_KEY: z.string(),
  JWT_REFRESH_PUBLIC_KEY: z.string(),
})

export type Env = z.infer<typeof envShema>
