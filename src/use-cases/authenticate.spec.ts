import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(usersRepository)
  })

  it('Should be able to register', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      email: 'Johndoe5@gmail.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })
})

it('Should be able to authenticate with worng email', async () => {
  expect(() =>
    sut.execute({
      email: 'Johndoe5@gmail.com',
      password: '123456',
    }),
  ).rejects.toBeInstanceOf(InvalidCredentialsError)
})

it('Should be able to authenticate with worng password', async () => {
  await usersRepository.create({
    name: 'John Doe',
    email: 'johndoe@example.com',
    password_hash: await hash('123456', 6),
  })

  expect(() =>
    sut.execute({
      email: 'Johndoe5@gmail.com',
      password: '123123',
    }),
  ).rejects.toBeInstanceOf(InvalidCredentialsError)
})
