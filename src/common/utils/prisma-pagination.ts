export interface PaginationParams {
  page?: number;
  perPage?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

type PrismaModel = {
  findMany: (args?: any) => Promise<any[]>;
  count: (args?: any) => Promise<number>;
};

export async function paginate<T>(
  model: PrismaModel,
  { page = 1, perPage = 10 }: PaginationParams,
  args: {
    where?: object;
    orderBy?: object;
    include?: object;
    select?: object;
  } = {},
): Promise<PaginatedResult<T>> {
  const [data, total] = await Promise.all([
    model.findMany({
      ...args,
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    model.count({ where: args.where }),
  ]);

  return {
    data,
    total,
    page,
    perPage,
    totalPages: Math.ceil(total / perPage),
  };
}
