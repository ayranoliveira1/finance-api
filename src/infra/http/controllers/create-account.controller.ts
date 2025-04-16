import { RegisterUseCase } from '@/domain/application/use-case/register'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { z } from 'zod'
import { UserAlreadyExistsError } from '@/domain/application/use-case/errors/user-already-exists-error'
import { Public } from '@/infra/auth/public'

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
})

type CreateAccountBodyType = z.infer<typeof createAccountBodySchema>

const bodyValidationPepe = new ZodValidationPipe(createAccountBodySchema)

@Controller('/auth/register')
@Public()
export class CreateAccountController {
  constructor(private registerUser: RegisterUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(@Body(bodyValidationPepe) body: CreateAccountBodyType) {
    createAccountBodySchema.parse(body)

    const { name, email, password } = body

    const result = await this.registerUser.execute({
      name,
      email,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case UserAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
