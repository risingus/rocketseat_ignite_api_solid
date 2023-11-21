import { UsersRepository } from '@/repositories/users-repository'
import { User } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface GetUsersProfileUseCaseRequest {
  userId: string
}

interface GetUsersProfileCaseResponse {
  user: User
}

export class GetUserprofileUseCase {
  // eslint-disable-next-line prettier/prettier
  constructor(private usersRepository: UsersRepository) { }

  async execute({
    userId,
  }: GetUsersProfileUseCaseRequest): Promise<GetUsersProfileCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    return {
      user,
    }
  }
}
