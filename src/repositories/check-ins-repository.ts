import { CheckIn, Prisma } from '@prisma/client';

export interface CheckInsRepository {
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>;
  findCheckInByUserOnDate(userId: string, date: Date): Promise<CheckIn | null>;
}
