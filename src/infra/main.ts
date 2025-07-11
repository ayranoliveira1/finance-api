import { NestFactory } from '@nestjs/core'

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { EnvService } from './env/env.service'
import * as bodyParser from 'body-parser'
import { AppModule } from './app.module'
import { ExpressAdapter } from '@nestjs/platform-express'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter())

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  })

  const expressInstance = app.getHttpAdapter().getInstance()

  app.use('/stripe/webhook', bodyParser.raw({ type: 'application/json' }))

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Finance API')
    .setDescription('Finance API Description')
    .setVersion('1.0')
    .addTag('finance')
    .build()

  const documentFactory = () => SwaggerModule.createDocument(app, swaggerConfig)

  SwaggerModule.setup('api', app, documentFactory)

  const envService = app.get(EnvService)
  const port = envService.get('PORT')

  expressInstance.set('trust proxy', true)

  await app.listen(port)
}
bootstrap()
