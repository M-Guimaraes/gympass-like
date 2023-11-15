import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { CreateGymUseCase } from './create-gym';

let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;

describe('Gyms Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new CreateGymUseCase(gymsRepository);
  });
  it('should be able to create a gym', async () => {
    const createGymsBody = {
      title: 'JavaScript Gym',
      phone: null,
      description: null,
      latitude: -33.8807237,
      longitude: 150.8064967,
    };
    const { gym } = await sut.execute(createGymsBody);

    expect(gym.id).toEqual(expect.any(String));
  });
});
