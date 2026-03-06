// src/admin/role/dto/role-response.dto.ts
import { Expose, Transform } from 'class-transformer';
import { PermissionResponseDto } from '../../permission/dto/permission-response.dto';

interface RolePermissionJoin {
  permission?: PermissionResponseDto;
  id?: string;
  name?: string;
}

export class RoleResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description?: string | null;

  @Expose()
  status: boolean;

  @Expose()
  @Transform(
    ({ obj }: { obj: { permissions?: RolePermissionJoin[] } }) => {
      return (obj.permissions ?? []).map((rp) => {
        const p = rp.permission ?? rp;
        return {
          id: p.id ?? '',
          name: p.name ?? '',
        } satisfies PermissionResponseDto;
      });
    },
    { toClassOnly: true },
  )
  permissions: PermissionResponseDto[];
}
