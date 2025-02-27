import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { z } from 'zod'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParam = z.infer<typeof pageQueryParamSchema>

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionsController {
  constructor(private prismaService: PrismaService) {
    this.prismaService = prismaService
  }

  @Get()
  async handle(@Query('page', queryValidationPipe) page: PageQueryParam) {
    const perPage = 1

    const questions = await this.prismaService.question.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * perPage,
      take: perPage,
    })

    return { questions }
  }
}
