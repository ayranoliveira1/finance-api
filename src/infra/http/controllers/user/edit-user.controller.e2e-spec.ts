import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'

describe('Edit user (E2E)', () => {
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

  test('[PATCH] /user', async () => {
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
      .patch('/user')
      .send({
        name: 'Jane Doe',
        email: 'ayranoliveira1@gmail.com',
      })
      .set('Authorization', `Bearer ${login.body.token}`)

    expect(response.statusCode).toBe(204)
  })

  test('[PATCH] /user confirm password', async () => {
    const login = await request(app.getHttpServer()).post('/auth/login').send({
      email: 'ayranoliveira1@gmail.com',
      password: '12345678',
      ip: '8.8.8.8',
    })

    const response = await request(app.getHttpServer())
      .patch('/user')
      .send({
        currentPassword: '12345678',
        newPassword: '87654321',
      })
      .set('Authorization', `Bearer ${login.body.token}`)

    expect(response.statusCode).toBe(204)
  })

  test('[PATCH] /user - should return 401 if user is not authenticated', async () => {
    const response = await request(app.getHttpServer()).patch('/user').send({
      name: 'Jane Doe',
      email: 'ayranoliveira1@gmail.com',
    })

    expect(response.statusCode).toBe(401)
  })
})
