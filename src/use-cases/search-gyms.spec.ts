import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { SearchGymUseCase } from './search-gyms';

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymUseCase;

//red, green, refactor

describe('Search Gym Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymUseCase(gymsRepository);
  });

  it('should be able to fetch user check ins history', async () => {
    await gymsRepository.create({
      title: 'JavaScript',
      phone: null,
      description: null,
      latitude: -33.8807237,
      longitude: 150.8064967,
    });

    await gymsRepository.create({
      title: 'TypeScript',
      phone: null,
      description: null,
      latitude: -33.8807237,
      longitude: 150.8064967,
    });

    const { gyms } = await sut.execute({
      query: 'JavaScript',
      page: 1,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: 'JavaScript' })]);
  });

  it('should be able to fetch paginated check ins history', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `TypeScript-${i}`,
        phone: null,
        description: null,
        latitude: -33.8807237,
        longitude: 150.8064967,
      });
    }

    const { gyms } = await sut.execute({
      query: 'TypeScript',
      page: 2,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'TypeScript-21' }),
      expect.objectContaining({ title: 'TypeScript-22' }),
    ]);
  });
});
