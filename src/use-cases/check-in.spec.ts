import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { CheckInUseCase } from './check-in';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { MaxNumberCheckInsError } from './errors/max-number-check-ins-error';
import { MaxDistanceError } from './errors/max-distance-error';

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

// red, green, refactor

describe('Check In Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInsRepository, gymsRepository);

    await gymsRepository.create({
      id: 'gym-01',
      description: '',
      title: '',
      phone: '',
      latitude: -33.8807237,
      longitude: 150.8064967,
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -33.8807237,
      userLongitude: 150.8064967,
    });

    expect(checkIn.id).toEqual(expect.any(String));
    expect(checkIn.created_at).toBeInstanceOf(Date);
  });

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -33.8807237,
      userLongitude: 150.8064967,
    });

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -33.8807237,
        userLongitude: 150.8064967,
      }),
    ).rejects.toBeInstanceOf(MaxNumberCheckInsError);
  });

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -33.8807237,
      userLongitude: 150.8064967,
    });

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -33.8807237,
      userLongitude: 150.8064967,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to check in on distante gym', async () => {
    await gymsRepository.create({
      id: 'gym-02',
      description: '',
      title: '',
      phone: '',
      latitude: -33.8807237,
      longitude: 150.8064967,
    });

    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -33.8666408,
        userLongitude: 150.8188109,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
