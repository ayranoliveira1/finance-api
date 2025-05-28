import { execSync } from 'child_process'

const skip = process.env.SKIP_PRISMA_POSTINSTALL === 'true'

if (skip) {
  console.log('🔁 Skipping Prisma postinstall (CI or non-production build).')
  process.exit(0)
}

try {
  console.log('📦 Running: prisma migrate deploy')
  execSync('prisma migrate deploy', { stdio: 'inherit' })

  console.log('🔧 Running: prisma generate')
  execSync('prisma generate', { stdio: 'inherit' })
} catch (err) {
  console.error('❌ Prisma postinstall failed:', err)
  process.exit(1)
}
