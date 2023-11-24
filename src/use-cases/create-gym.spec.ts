import { expect, it, describe, beforeEach } from 'vitest'
import { InMemoryGymsRepositories } from '@/repositories/in-memory/in-memory-gyms-repository'
import { CreateGymUseCase } from './create-gym'

let gymRepository: InMemoryGymsRepositories
let sut: CreateGymUseCase

describe('Create Gym use case', () => {
  beforeEach(() => {
    gymRepository = new InMemoryGymsRepositories()
    sut = new CreateGymUseCase(gymRepository)
  })

  it('should be able to crete gym', async () => {
    const { gym } = await sut.execute({
      latitude: -3.7267476,
      longitude: -38.5165226,
      phone: '',
      title: 'Javascript-Gym',
      description: '',
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
