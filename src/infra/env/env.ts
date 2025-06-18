import { z } from 'zod'

export const envShema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().optional().default(3333),
  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),
  STRIPE_PREMIUM_PLAN_PRICE_ID: z.string(),
  STRIPE_SECRET_KEY: z.string(),
  STRIPE_WEBHOOK_SECRET: z.string(),
  APP_URL: z.string().url(),
  OPENAI_API_KEY: z.string(),
  CRYPTO_SECRET_KEY: z.string(),
  EMAIL_REDIRECT_URI: z.string().url(),
  EMAIL_REFRESH_TOKEN: z.string(),
  EMAIL_CLIENT_SECRET: z.string(),
  EMAIL_CLIENT_ID: z.string(),
  EMAIL_USER: z.string().email(),
})

export type Env = z.infer<typeof envShema>
