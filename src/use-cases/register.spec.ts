import { expect, it, describe, beforeEach } from 'vitest'
import { RegisterUsecase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepositories } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

let usersRepository: InMemoryUsersRepositories
let sut: RegisterUsecase

describe('Register use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepositories()
    sut = new RegisterUsecase(usersRepository)
  })

  it('should be able to register', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@exemple.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@exemple.com',
      password: '123456',
    })

    const isPasswordCorretlyHashed = await compare('123456', user.password_hash)

    expect(isPasswordCorretlyHashed).toBe(true)
  })

  it('should not be able to register with sabe email twice', async () => {
    const email = 'johndoe@exemple.com'

    await sut.execute({
      name: 'John Doe',
      email,
      password: '123456',
    })

    expect(async () => {
      await sut.execute({
        name: 'John Doe',
        email,
        password: '123456',
      })
    }).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
