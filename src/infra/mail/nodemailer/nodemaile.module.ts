import { EnvService } from '@/infra/env/env.service'
import { Module } from '@nestjs/common'
import { NodemailerMailService } from './nodemailer-mail.service'
import { Mail } from '@/domain/application/mail/mail'

@Module({
  providers: [
    EnvService,
    NodemailerMailService,
    {
      provide: Mail,
      useClass: NodemailerMailService,
    },
  ],
  exports: [EnvService, Mail, NodemailerMailService],
})
export class NodemailerModule {}
