import { beforeEach, describe, expect, it } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlredyExistsError } from './errors/user-alredy-exists-error'

// const usersRepository = new InMemoryUsersRepository()
// const registerUseCase = new RegisterUseCase(usersRepository)

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })

  it('Should be able to register', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'Johndoe5@gmail.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('Should hash user password upon registration', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'Johndoe5@gmail.com',
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })
})

it('Should not be able to register with same email twice', async () => {
  const email = 'johndoe@example.com'

  await sut.execute({
    name: 'John Doe',
    email,
    password: '123456',
  })

  await expect(() =>
    sut.execute({
      name: 'John Doe',
      email,
      password: '123456',
    }),
  ).rejects.toBeInstanceOf(UserAlredyExistsError)
})
