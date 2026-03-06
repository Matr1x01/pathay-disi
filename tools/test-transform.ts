import 'reflect-metadata';
import { plainToInstance, instanceToPlain } from 'class-transformer';
import { RoleResponseDto } from '../src/admin/role/dto/role-response.dto';

const role = {
  id: 'cmmb1n7m10000z8tv7kjqcg7l',
  name: 'Admin',
  description: 'The Admin User',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  permissions: [
    {
      id: 'rp1',
      roleId: 'cmmb1n7m10000z8tv7kjqcg7l',
      permissionId: 'p1',
      assignedAt: new Date().toISOString(),
      permission: {
        id: 'p1',
        name: 'View Dashboard',
        description: 'View',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    },
  ],
};

const instance = plainToInstance(RoleResponseDto as any, role, { excludeExtraneousValues: true });
console.log('Class instance:', instance);
const plain = instanceToPlain(instance);
console.log('Plain output:', JSON.stringify(plain, null, 2));

