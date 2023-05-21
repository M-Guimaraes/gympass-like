import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { AuthenticateUseCase } from './authenticate';
import { hash } from 'bcryptjs';
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error';

const registerBody = {
  email: 'marceloguimaraes@outlook.com.br',
  password: '123456',
};

let inMemoryRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    inMemoryRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(inMemoryRepository);
  });

  it('should be able to authenticate', async () => {
    await inMemoryRepository.create({
      email: 'marceloguimaraes@outlook.com.br',
      name: 'Marcelo Guimaraes',
      password_hash: await hash('123456', 6),
    });

    const { user } = await sut.execute(registerBody);

    expect(user.id).toEqual(expect.any(String));
  });

  it('should not be able to authenticate with wrong email', async () => {
    await expect(() => sut.execute(registerBody)).rejects.toBeInstanceOf(
      InvalidCredentialsError
    );
  });

  it('should not be able to authenticate with wrong password', async () => {
    await inMemoryRepository.create({
      email: 'marceloguimaraes@outlook.com.br',
      name: 'Marcelo Guimaraes',
      password_hash: await hash('123457', 6),
    });

    await expect(() => sut.execute(registerBody)).rejects.toBeInstanceOf(
      InvalidCredentialsError
    );
  });
});
