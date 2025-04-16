import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { envShema } from './env/env'
import { EnvModule } from './env/env.module'
import { HttpModule } from './http/http.module'
import { AuthModule } from './auth/auth.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envShema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
    EnvModule,
    HttpModule,
  ],
})
export class AppModule {}
