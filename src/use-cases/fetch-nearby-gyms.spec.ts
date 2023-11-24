import { expect, it, describe, beforeEach } from 'vitest'
import { InMemoryGymsRepositories } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FetchNearbyGymsUseCase } from './fetch-neaby-gyms'

let gymsRepository: InMemoryGymsRepositories
let sut: FetchNearbyGymsUseCase

describe('Fetch nearby use case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepositories()
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Near-Gym',
      description: '',
      latitude: -3.7267476,
      longitude: -38.5165226,
      phone: '',
    })

    await gymsRepository.create({
      title: 'Far-Gym',
      description: '',
      latitude: -4.1860817,
      longitude: -38.4846527,
      phone: '',
    })

    const { gyms } = await sut.execute({
      userLatitude: -3.7267476,
      userLongitude: -38.5165226,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near-Gym' })])
  })
})
