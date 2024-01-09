import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { GetUserprofileUseCase } from '../get-user-profile'

export function makeGetUserProfileUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const useCase = new GetUserprofileUseCase(usersRepository)
  return useCase
}
