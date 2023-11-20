import { CheckInsRepository } from '@/repositories/check-ins-repository';
import { ResourceNotFoundError } from './errors/resource-not-found';

interface GetUserMetricsUseCaseBody {
  userId: string;
}

interface GetUserMetricsCaseResponse {
  checkInsCount: number;
}

export class GetUserMetricsUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
  }: GetUserMetricsUseCaseBody): Promise<GetUserMetricsCaseResponse> {
    const checkInsCount = await this.checkInsRepository.countByUserId(userId);

    if (!checkInsCount) {
      throw new ResourceNotFoundError();
    }

    return {
      checkInsCount,
    };
  }
}
