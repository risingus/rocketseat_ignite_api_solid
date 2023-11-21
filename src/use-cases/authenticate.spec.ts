import { expect, it, describe, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepositories } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let usersRepository: InMemoryUsersRepositories
let sut: AuthenticateUseCase

describe('Authenticate use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepositories()
    sut = new AuthenticateUseCase(usersRepository)
  })

  it('should be able to authenticate', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@exemple.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      email: 'johndoe@exemple.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should be able to authenticate with wrong email', async () => {
    await expect(
      async () =>
        await sut.execute({
          email: 'johndoe@exemple.com',
          password: '123456',
        }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should be able to authenticate with wrong password', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@exemple.com',
      password_hash: await hash('123456', 6),
    })

    await expect(
      async () =>
        await sut.execute({
          email: 'johndoe@exemple.com',
          password: '123123',
        }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
