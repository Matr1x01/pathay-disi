// src/admin/permission/dto/permission-response.dto.ts
import { Expose } from 'class-transformer';

export class PermissionResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;
}
