import { safeUpsertOrFindUnique } from './prisma.utils';
import { Prisma } from '@nextjs-expressjs-postgre-sql/shared';

describe('safeUpsertOrFindUnique', () => {
  const where = { id: 1 };
  const args = { where, create: {}, update: {} };

  const successfulResult = { id: 1, name: 'Test' };

  let mockDelegate: any;

  beforeEach(() => {
    mockDelegate = {
      upsert: jest.fn(),
      findUnique: jest.fn(),
    };
  });

  it('should return result from upsert if successful', async () => {
    mockDelegate.upsert.mockResolvedValue(successfulResult);

    const result = await safeUpsertOrFindUnique(mockDelegate, args);
    expect(result).toEqual(successfulResult);
    expect(mockDelegate.upsert).toHaveBeenCalledWith(args);
    expect(mockDelegate.findUnique).not.toHaveBeenCalled();
  });

  it('should call findUnique and return existing record on unique constraint error', async () => {
    const uniqueError = new Prisma.PrismaClientKnownRequestError(
      'Unique constraint failed on the fields: (`id`)',
      {
        code:'P2002',
        clientVersion:'client-version'
      }
    );

    mockDelegate.upsert.mockRejectedValue(uniqueError);
    mockDelegate.findUnique.mockResolvedValue(successfulResult);

    const result = await safeUpsertOrFindUnique(mockDelegate, args);
    expect(result).toEqual(successfulResult);
    expect(mockDelegate.findUnique).toHaveBeenCalledWith({ where });
  });

  it('should throw error if race condition leads to no existing record found', async () => {
    const uniqueError = new Prisma.PrismaClientKnownRequestError(
      'Unique constraint failed on the fields: (`id`)',
      {
        code:'P2002',
        clientVersion:'client-version'
      }
    );

    mockDelegate.upsert.mockRejectedValue(uniqueError);
    mockDelegate.findUnique.mockResolvedValue(null);

    await expect(safeUpsertOrFindUnique(mockDelegate, args)).rejects.toThrow(
      `Race condition unable to find Unique (${JSON.stringify(where)})`
    );
  });

  it('should rethrow unexpected error', async () => {
    const unexpectedError = new Error('Unexpected failure');
    mockDelegate.upsert.mockRejectedValue(unexpectedError);

    await expect(safeUpsertOrFindUnique(mockDelegate, args)).rejects.toThrow('Unexpected failure');
    expect(mockDelegate.findUnique).not.toHaveBeenCalled();
  });
});