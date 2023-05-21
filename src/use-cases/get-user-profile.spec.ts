import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { GetUserProfileUseCase } from './get-user-profile';
import { hash } from 'bcryptjs';
import { ResourceNotFoundError } from './errors/resource-not-found';

let inMemoryRepository: InMemoryUsersRepository;
let sut: GetUserProfileUseCase;

describe('Get Profile Use Case', () => {
  beforeEach(() => {
    inMemoryRepository = new InMemoryUsersRepository();
    sut = new GetUserProfileUseCase(inMemoryRepository);
  });

  it('should be able to get user profile', async () => {
    const registerBody = {
      name: 'Marcelo Guimaraes da Silva',
      email: 'marceloguimaraes@outlook.com.br',
      password_hash: await hash('123456', 6),
    };

    const createdUser = await inMemoryRepository.create(registerBody);

    const { user } = await sut.execute({ userId: createdUser.id });

    expect(user.name).toEqual('Marcelo Guimaraes da Silva');
  });

  it('should not be able to get user profile with wrong id', async () => {
    await expect(() =>
      sut.execute({ userId: 'non-existing-id' })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
