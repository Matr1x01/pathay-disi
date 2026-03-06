import { Expose, Transform } from 'class-transformer';

interface AdminRoleRef {
  roleId: string;
  role: {
    id: string;
    name: string;
  };
}

export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  phone: string;

  @Expose()
  @Transform(({ obj }) => obj.isActive)
  status: boolean;

  @Expose()
  @Transform(({ obj }) =>
    (obj.roles ?? []).map(
      (
        r: AdminRoleRef,
      ): {
        id: string;
        name: string;
      } => ({
        id: r.role.id,
        name: r.role.name,
      }),
    ),
  )
  roles: { id: string; name: string }[];
}
