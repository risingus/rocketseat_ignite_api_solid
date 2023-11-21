import { expect, it, describe, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepositories } from '@/repositories/in-memory/in-memory-users-repository'
import { GetUserprofileUseCase } from './get-user-profile'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let usersRepository: InMemoryUsersRepositories
let sut: GetUserprofileUseCase

describe('Get user profile use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepositories()
    sut = new GetUserprofileUseCase(usersRepository)
  })

  it('should be able to get user profile', async () => {
    const createdUser = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@exemple.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({ userId: createdUser.id })

    expect(user.id).toEqual(expect.any(String))
    expect(user.name).toEqual('John Doe')
  })

  it('should not be able to get user profile with wrong id', async () => {
    await expect(
      async () => await sut.execute({ userId: 'non-existing-id' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
