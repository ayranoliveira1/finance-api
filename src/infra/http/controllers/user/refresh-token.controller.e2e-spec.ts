import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'

describe('Refresh token (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get<PrismaService>(PrismaService)

    await app.init()
  })

  test('[POST] /auth/refresh-token', async () => {
    await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        password: await hash('12345678', 8),
      },
    })

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'johndoe@gmail.com',
        password: '12345678',
        ip: '8.8.8.8',
      })

    const refreshToken = response.headers['set-cookie'][0]
      .split(';')[0]
      .split('=')[1]
    const sessionId = response.headers['set-cookie'][1]
      .split(';')[0]
      .split('=')[1]

    const refreshResponse = await request(app.getHttpServer())
      .post('/auth/refresh-token')
      .set('Cookie', `refresh_token=${refreshToken}; session_id=${sessionId}`)
      .send()

    expect(refreshResponse.statusCode).toBe(201)
    expect(refreshResponse.body).toEqual(
      expect.objectContaining({
        token: expect.any(String),
      }),
    )
  })
})
