import { describe, expect, it } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlredyExistsError } from './errors/user-alredy-exists'

describe('Register Use Case', () => {
  it('Should be able to register', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const { user } = await registerUseCase.execute({
      name: 'John Doe',
      email: 'Johndoe5@gmail.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('Should hash user password upon registration', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const { user } = await registerUseCase.execute({
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
  const usersRepository = new InMemoryUsersRepository()
  const registerUseCase = new RegisterUseCase(usersRepository)

  const email = 'johndoe@example.com'

  await registerUseCase.execute({
    name: 'John Doe',
    email,
    password: '123456',
  })

  await expect(() =>
    registerUseCase.execute({
      name: 'John Doe',
      email,
      password: '123456',
    }),
  ).rejects.toBeInstanceOf(UserAlredyExistsError)
})