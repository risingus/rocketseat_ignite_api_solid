import { expect, it, describe, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepositories } from '@/repositories/in-memory/in-memory-check-ins-repository copy'
import { CheckInUsecase } from './checkin'
import { randomUUID } from 'node:crypto'

let checkInsRepository: InMemoryCheckInsRepositories
let sut: CheckInUsecase

describe('Check-in use case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepositories()
    sut = new CheckInUsecase(checkInsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: randomUUID(),
      userId: randomUUID(),
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: randomUUID(),
      userId: randomUUID(),
    })

    await expect(
      async () =>
        await sut.execute({
          gymId: randomUUID(),
          userId: randomUUID(),
        }),
    ).rejects.toBeInstanceOf(Error)
  })
})
