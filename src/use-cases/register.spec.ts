import { describe, it, expect, beforeEach } from 'vitest';
import { RegisterUseCase } from './register';
import { compare } from 'bcryptjs';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error';

let inMemoryRepository: InMemoryUsersRepository;
let sut: RegisterUseCase;

describe('Register Use Case', () => {
  beforeEach(() => {
    inMemoryRepository = new InMemoryUsersRepository();
    sut = new RegisterUseCase(inMemoryRepository);
  });
  it('should be able to register', async () => {
    const registerBody = {
      name: 'Marcelo Guimaraes da Silva',
      email: 'marceloguimaraes@outlook.com.br',
      password: '123456',
    };
    const { user } = await sut.execute(registerBody);

    expect(user.id).toEqual(expect.any(String));
    expect(user.created_at).toBeInstanceOf(Date);
  });

  it('should hash user password upon registration', async () => {
    const registerBody = {
      name: 'Marcelo Guimaraes da Silva',
      email: 'marceloguimaraes@outlook.com.br',
      password: '123456',
    };
    const { user } = await sut.execute(registerBody);

    const passwordIsCorrectly = await compare(
      registerBody.password,
      user.password_hash
    );

    expect(passwordIsCorrectly).toBe(true);
  });

  it('should not be able to register with same email twice', async () => {
    const email = 'johndoe@example.com';

    await sut.execute({
      name: 'Marcelo Guimaraes da Silva',
      email,
      password: '123456',
    });

    await expect(() =>
      sut.execute({
        name: 'Marcelo Guimaraes da Silva',
        email,
        password: '123456',
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
