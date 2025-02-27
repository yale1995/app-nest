import request from 'supertest'
import { describe } from 'vitest'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AppModule } from '@/app.module'
import { PrismaService } from '@/prisma/prisma.service'
import { compare } from 'bcryptjs'

describe('Create account controller (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    await app.init()
  })

  test('[POST] /accounts', async () => {
    const response = await request(app.getHttpServer()).post('/accounts').send({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
    })

    expect(response.statusCode).toBe(201)

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        email: 'john.doe@example.com',
      },
    })

    expect(userOnDatabase).toBeTruthy()
    expect(userOnDatabase?.id).toBeDefined()
    expect(userOnDatabase?.password).toBeDefined()
    expect(userOnDatabase?.password).not.toBe('123456')
    expect(await compare('123456', userOnDatabase!.password)).toBe(true)
  })
})
