import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'

describe('Get Dashboard Data (E2E)', () => {
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

  test('[Get] /dashboard', async () => {
    await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        password: await hash('12345678', 8),
      },
    })

    const user = await request(app.getHttpServer()).post('/auth/login').send({
      email: 'johndoe@gmail.com',
      password: '12345678',
      ip: '8.8.8.8',
    })

    for (let i = 0; i < 10; i++) {
      await request(app.getHttpServer())
        .post('/transactions')
        .send({
          name: `Transaction ${i + 1}`,
          amount: 100,
          category: 'FOOD',
          date: new Date(),
          type: 'EXPENSE',
          paymentMethod: 'CREDIT_CARD',
        })
        .set('Authorization', `Bearer ${user.body.token}`)
    }

    const month = (new Date().getMonth() + 1).toString()
    const year = new Date().getFullYear().toString()

    const response = await request(app.getHttpServer())
      .get(`/dashboard/?month=${month}&year=${year}`)
      .set('Authorization', `Bearer ${user.body.token}`)

    expect(response.statusCode).toBe(200)
  })
})
