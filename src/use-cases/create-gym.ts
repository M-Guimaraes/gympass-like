import { Gym } from '@prisma/client';
import { ResourceNotFoundError } from './errors/resource-not-found';
import { GymsRepository } from '@/repositories/gyms-repository';

interface CreateGymUseCaseRequest {
  title: string;
  description: string | null;
  phone: string | null;
  latitude: number;
  longitude: number;
}

interface CreateGymUseCaseResponse {
  gym: Gym;
}

export class CreateGymUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    title,
    phone,
    description,
    latitude,
    longitude,
  }: CreateGymUseCaseRequest): Promise<CreateGymUseCaseResponse> {
    const gym = await this.gymsRepository.create({
      title,
      phone,
      description,
      latitude,
      longitude,
    });

    if (!gym) {
      throw new ResourceNotFoundError();
    }

    return {
      gym,
    };
  }
}
