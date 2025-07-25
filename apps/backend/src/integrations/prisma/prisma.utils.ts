import { Prisma } from '@nextjs-expressjs-postgre-sql/shared';

export async function safeUpsertOrFindUnique<
  Delegate extends {
    upsert(args: UpsertArgs): Promise<Result>;
    findUnique(args: { where: Where }): Promise<Result | null>;
  },
  Args extends Parameters<Delegate['upsert']>[0],
  UpsertArgs extends { where: Where },
  Where,
  Result = Awaited<ReturnType<Delegate['upsert']>>,
>(
  model: Delegate,
  args: Args
): Promise<Result> {
  try {
    return await model.upsert(args);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      (error.code === 'P2002' ||
        error.message.includes('Unique constraint failed'))
    ) {
      const existingRecord = await model.findUnique({ where: args.where });

      if (!existingRecord)
        throw new Error(`Race condition unable to find Unique (${JSON.stringify(args.where)})`);

      return existingRecord;
    }

    throw error;
  }
}