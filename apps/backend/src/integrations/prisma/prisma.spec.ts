import { initializeDB, prisma } from './index';

jest.mock('@nextjs-expressjs-postgre-sql/shared', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      $connect: jest.fn(),
    })),
  };
});

describe('initializeDB', () => {
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => { return });
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {return});
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  afterAll(() => {
    jest.resetModules();
  });

  it('should connect to the database successfully on first try', async () => {
    (prisma.$connect as jest.Mock).mockResolvedValueOnce(undefined);

    await initializeDB();

    expect(prisma.$connect).toHaveBeenCalledTimes(1);
    expect(consoleLogSpy).toHaveBeenCalledWith('✅  Connected to the database.');
  });

  it('should retry connection if it fails', async () => {
    // First call fails, second call succeeds
    (prisma.$connect as jest.Mock)
      .mockRejectedValueOnce(new Error('Connection failed'))
      .mockResolvedValueOnce(undefined);

    const initPromise = initializeDB();

    // Fast-forward 3 seconds
    await Promise.resolve(); // ensure rejected promise is handled
    expect(consoleErrorSpy).toHaveBeenCalledWith('❌  DB connection failed. Retrying in 3 seconds...');
    jest.advanceTimersByTime(3000);

    await initPromise;

    expect(prisma.$connect).toHaveBeenCalledTimes(2);
    expect(consoleLogSpy).toHaveBeenCalledWith('✅  Connected to the database.');
  });
});