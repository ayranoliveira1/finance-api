import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'

describe('Delete Transaction (E2E)', () => {
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

  test('[Delete] /transactions', async () => {
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

    const transaction = await request(app.getHttpServer())
      .post('/transactions')
      .send({
        name: 'Transaction 1',
        amount: 100,
        date: new Date(),
        category: 'FOOD',
        type: 'EXPENSE',
        paymentMethod: 'CREDIT_CARD',
      })
      .set('Authorization', `Bearer ${user.body.token}`)

    const response = await request(app.getHttpServer())
      .delete(`/transactions/${transaction.body.id}`)
      .set('Authorization', `Bearer ${user.body.token}`)

    expect(response.statusCode).toBe(204)
  })
})
