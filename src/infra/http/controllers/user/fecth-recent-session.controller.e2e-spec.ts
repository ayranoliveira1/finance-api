import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'

describe('Fecth Recent Session (E2E)', () => {
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

  test('[GET] /sessions/recent', async () => {
    await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        password: await hash('12345678', 8),
      },
    })

    const login = await request(app.getHttpServer()).post('/auth/login').send({
      email: 'johndoe@gmail.com',
      password: '12345678',
      ip: '8.8.8.8',
    })

    const response = await request(app.getHttpServer())
      .get('/sessions/recent')
      .set('Authorization', `Bearer ${login.body.token}`)

    expect(response.statusCode).toBe(200)

    expect(response.body).toEqual(
      expect.objectContaining({
        session: expect.objectContaining({
          id: expect.any(String),
        }),
      }),
    )
  })
})
