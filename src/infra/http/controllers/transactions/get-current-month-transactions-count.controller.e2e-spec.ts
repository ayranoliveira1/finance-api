import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'

describe('Get current month transactions count (E2E)', () => {
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

  test('[Get] /transactions/current-month/count', async () => {
    await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        password: await hash('12345678', 8),
        isEmailVerified: true,
      },
    })

    const user = await request(app.getHttpServer()).post('/auth/login').send({
      email: 'johndoe@gmail.com',
      password: '12345678',
      ip: '8.8.8.8',
    })

    await request(app.getHttpServer())
      .post('/transactions')
      .send({
        name: 'Transaction 1',
        amount: 100,
        category: 'FOOD',
        date: new Date(),
        type: 'EXPENSE',
        paymentMethod: 'CREDIT_CARD',
      })
      .set('Authorization', `Bearer ${user.body.token}`)

    await request(app.getHttpServer())
      .post('/transactions')
      .send({
        name: 'Transaction 2',
        amount: 100,
        category: 'FOOD',
        date: new Date(),
        type: 'EXPENSE',
        paymentMethod: 'CREDIT_CARD',
      })
      .set('Authorization', `Bearer ${user.body.token}`)

    const response = await request(app.getHttpServer())
      .get('/transactions/current-month/count')
      .set('Authorization', `Bearer ${user.body.token}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        count: 2,
      }),
    )
  })
})
