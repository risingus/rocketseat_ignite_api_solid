import { expect, it, describe, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepositories } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUsecase } from './checkin'
import { randomUUID } from 'node:crypto'
import { InMemoryGymsRepositories } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxDistanceError } from './errors/max-distance-error'
import { MaxNumberOfCheckInsError } from './errors/max-numbers-of-check-ins-error'

let checkInsRepository: InMemoryCheckInsRepositories
let gymsRepository: InMemoryGymsRepositories
let sut: CheckInUsecase

describe('Check-in use case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepositories()
    gymsRepository = new InMemoryGymsRepositories()
    sut = new CheckInUsecase(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-01',
      title: 'javascript gym',
      description: '',
      latitude: new Decimal(0),
      longitude: new Decimal(0),
      phone: '',
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: randomUUID(),
      userLatitude: 0,
      userLongitude: 0,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0))
    const userId = randomUUID()

    await sut.execute({
      gymId: 'gym-01',
      userId,
      userLatitude: 0,
      userLongitude: 0,
    })

    await expect(
      async () =>
        await sut.execute({
          gymId: 'gym-01',
          userId,
          userLatitude: 0,
          userLongitude: 0,
        }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should not be able to check in distant gym', async () => {
    await gymsRepository.create({
      id: 'gym-02',
      title: 'javascript gym',
      description: '',
      latitude: new Decimal(-3.7267476),
      longitude: new Decimal(-38.5165226),
      phone: '',
    })

    await expect(
      async () =>
        await sut.execute({
          gymId: 'gym-02',
          userId: randomUUID(),
          userLatitude: -3.8251901,
          userLongitude: -38.4248003,
        }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
