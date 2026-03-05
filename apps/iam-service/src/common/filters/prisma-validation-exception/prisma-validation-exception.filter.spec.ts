import { PrismaValidationExceptionFilter } from './prisma-validation-exception.filter';

describe('PrismaValidationExceptionFilter', () => {
  it('should be defined', () => {
    expect(new PrismaValidationExceptionFilter()).toBeDefined();
  });
});
