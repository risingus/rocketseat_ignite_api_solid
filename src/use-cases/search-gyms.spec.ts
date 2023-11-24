import { expect, it, describe, beforeEach } from 'vitest'
import { InMemoryGymsRepositories } from '@/repositories/in-memory/in-memory-gyms-repository'
import { SearchGymsUseCase } from './search-gyms'

let gymsRepository: InMemoryGymsRepositories
let sut: SearchGymsUseCase

describe('Search gyms use case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepositories()
    sut = new SearchGymsUseCase(gymsRepository)
  })

  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      title: 'Javascript-Gym',
      description: '',
      latitude: 0,
      longitude: 0,
      phone: '',
    })

    await gymsRepository.create({
      title: 'Typescript-Gym',
      description: '',
      latitude: 0,
      longitude: 0,
      phone: '',
    })

    const { gyms } = await sut.execute({
      query: 'Typescript-Gym',
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Typescript-Gym' })])
  })

  it('should be able to fetch paginated gyms', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `Typescript-Gym ${i}`,
        description: '',
        latitude: 0,
        longitude: 0,
        phone: '',
      })
    }

    const { gyms } = await sut.execute({
      query: 'Typescript-Gym',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Typescript-Gym 21' }),
      expect.objectContaining({ title: 'Typescript-Gym 22' }),
    ])
  })
})
