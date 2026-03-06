import { ClassConstructor, plainToInstance, } from 'class-transformer';
import { PaginatedResult } from './prisma-pagination';

/**
 * Serialize a single plain object or class instance to a plain object using a DTO class.
 * Keeps only fields decorated with @Expose() when excludeExtraneousValues is true.
 */
export function serialize<T, V>(dto: ClassConstructor<T>, value: V) {
  return plainToInstance(dto, value, {
    excludeExtraneousValues: true,
  });
}

/**
 * Serialize an array of plain objects or class instances to plain objects using a DTO class.
 */
export function serializeArray<T, V>(dto: ClassConstructor<T>, values: V[]) {
  return values.map((v) => serialize(dto, v));
}

export function serializePaginated<T, V>(
  dto: ClassConstructor<T>,
  result: PaginatedResult<V>,
) {
  return {
    pagination: {
      total: result.total,
      page: result.page,
      perPage: result.perPage,
      totalPages: result.totalPages,
    },
    data: serializeArray(dto, result.data),
  };
}
