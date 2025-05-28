import { execSync } from 'child_process'

function runCommand(command: string) {
  try {
    console.log(`🛠️  Running: ${command}`)
    execSync(command, { stdio: 'inherit' })
  } catch (error) {
    console.error(`❌ Error running "${command}":`, error)
    process.exit(1)
  }
}

function main() {
  const skip = process.env.SKIP_PRISMA_POSTINSTALL === 'true'

  if (skip) {
    console.log('⏭️  Skipping Prisma postinstall (CI or non-production build).')
    return
  }

  if (!process.env.DATABASE_URL) {
    console.warn('⚠️  DATABASE_URL is not set. Prisma might fail.')
  }

  runCommand('prisma migrate deploy')
  runCommand('prisma generate')
}

main()
