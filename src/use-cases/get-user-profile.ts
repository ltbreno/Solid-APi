import { UsersRepository } from '@/repositories/users-repository'
import { User } from '@prisma/client'
import { ResourceNotExists } from './errors/resource-not-exists-error'

interface GetUserProfileUseCaseRequest {
  userId: string
}

interface GetUserProfileUseCaseResponse {
  user: User
}

export class GetUserProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
    // buscar o user no banco pelo email
    // comparar a senha salva no banco com a senha enviada

    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotExists()
    }

    return {
      user,
    }
  }
}
