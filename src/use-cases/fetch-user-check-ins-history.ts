import { CheckInsRepository } from '@/repositories/check-ins-repository';
import { CheckIn } from '@prisma/client';
import { ResourceNotFoundError } from './errors/resource-not-found';

interface FetchUserCheckInsHistoryUseCaseBody {
  page: number;
  userId: string;
}

interface FetchUserCheckInsHistoryCaseResponse {
  checkIns: CheckIn[];
}

export class FetchUserCheckInsHistoryUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
    page,
  }: FetchUserCheckInsHistoryUseCaseBody): Promise<FetchUserCheckInsHistoryCaseResponse> {
    const checkIns = await this.checkInsRepository.findManyByUserId(
      userId,
      page,
    );

    if (!checkIns) {
      throw new ResourceNotFoundError();
    }

    return {
      checkIns,
    };
  }
}
