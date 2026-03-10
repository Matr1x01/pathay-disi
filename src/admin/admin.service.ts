import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IUser } from 'src/common/interfaces/user.interface';
import { AdminRepository } from './admin.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AppCacheService } from '../app-cache/app-cache.service';
import { RoleRepository } from './role/role.repository';
import { AdminRole, Permission, Role, RolePermission } from '@prisma/client';
import { CreateUserDto } from './users/dto/create-user.dto';
import { serialize, serializePaginated } from '../common/utils/serialize.util';
import { UserResponseDto } from './users/dto/user-response.dto';
import { ChangePasswordDto } from './users/dto/change-password.dto';

@Injectable()
export class AdminService {
  constructor(
    private jwtService: JwtService,
    private appCache: AppCacheService,
    private adminRepository: AdminRepository,
    private roleRepository: RoleRepository,
  ) {}
  async login(email: string, password: string) {
    const admin = await this.adminRepository.getActiveByEmail(email);

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      throw new BadRequestException('Invalid email or password');
    }

    return { token: this.generateAdminToken(admin) };
  }

  private generateAdminToken(admin: {
    id: string;
    name: string;
    email: string;
  }) {
    const payload = {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      type: 'admin',
    };
    const expiresIn = parseInt(process.env.JWT_EXPIRES_IN || '3600'); // default to 1 hour if not set

    return this.jwtService.sign(payload, { expiresIn: expiresIn });
  }

  logout(iUser: IUser) {
    console.log(iUser);
    // Invalidate the token by adding it to the cache with its expiration time
    return true;
  }

  async getProfile(adminId: string) {
    const admin = await this.adminRepository.findById(adminId);
    if (!admin) {
      throw new BadRequestException('Admin not found');
    }

    return serialize(UserResponseDto, admin);
  }
  // to find and validate admin users.
  async validateUser(adminId: string): Promise<IUser | null> {
    const admin = await this.adminRepository.findById(adminId, true, true);
    if (admin) {
      const { roles, permissions } = this.getAdminRolesPermissions(admin);
      return {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        type: 'admin',
        roles,
        permissions,
      };
    }
    return null;
  }

  async syncRoles(adminId: string, roleIds: string[]) {
    const admin = await this.findOne(adminId);

    const roles = await this.roleRepository.findByIds(roleIds);

    if (roles.length !== roleIds.length) {
      throw new BadRequestException('One or more roles not found');
    }

    await this.adminRepository.updateRoles(admin.id, roleIds);
    return { message: 'Roles synchronized successfully' };
  }

  async me(iUser: IUser) {
    const admin = await this.adminRepository.findById(iUser.id, true, true);
    if (!admin) {
      throw new BadRequestException('Admin not found');
    }

    const { roles, permissions } = this.getAdminRolesPermissions(admin);

    return {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      roles,
      permissions,
    };
  }

  async create(createUserDto: CreateUserDto) {
    const admin = await this.adminRepository.create({
      name: createUserDto.name,
      email: createUserDto.email,
      password: await bcrypt.hash(createUserDto.password, 10),
      phone: createUserDto.phone,
      status: createUserDto.status,
    });

    if (createUserDto.roles && createUserDto.roles.length > 0) {
      const roles = await this.roleRepository.findByIds(createUserDto.roles);
      if (roles.length !== createUserDto.roles.length) {
        throw new BadRequestException('One or more roles not found');
      }
      await this.adminRepository.updateRoles(admin.id, createUserDto.roles);
    }

    return serialize(UserResponseDto, admin);
  }

  async findAll(
    page: number,
    perPage: number,
    search: string,
    sortBy: string,
    direction: 'asc' | 'desc',
    status?: boolean,
    roles?: string,
  ) {
    // return await this.adminRepository.findAll();
    return serializePaginated(
      UserResponseDto,
      await this.adminRepository.findAll(
        page,
        perPage,
        search,
        sortBy,
        direction,
        status,
        roles ? roles.split(',') : [],
      ),
    );
  }

  async findOne(id: string) {
    const user = await this.adminRepository.findById(id, true, false);

    if (!user) {
      throw new NotFoundException('Admin not found');
    }

    return serialize(UserResponseDto, user);
  }

  async update(id: string, updateAdminDto: Partial<CreateUserDto>) {
    const admin = await this.findOne(id);

    const response = await this.adminRepository.update(id, {
      name: updateAdminDto.name ?? admin.name,
      email: updateAdminDto.email ?? admin.email,
      phone: updateAdminDto.phone ?? admin.phone,
      isActive: updateAdminDto.status ?? admin.status,
    });

    if (updateAdminDto.roles) {
      const roles = await this.roleRepository.findByIds(updateAdminDto.roles);
      if (roles.length !== updateAdminDto.roles.length) {
        throw new BadRequestException('One or more roles not found');
      }
      await this.adminRepository.updateRoles(id, updateAdminDto.roles);
    }
    return serialize(UserResponseDto, response);
  }

  async remove(id: string) {
    const admin = await this.findOne(id);

    return serialize(
      UserResponseDto,
      await this.adminRepository.remove(admin.id),
    );
  }

  async changePassword(adminId: string, changePasswordDto: ChangePasswordDto) {
    const admin = await this.adminRepository.findById(adminId);

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    if (!bcrypt.compareSync(changePasswordDto.oldPassword, admin.password)) {
      throw new BadRequestException('Old password is incorrect');
    }

    const hashedNewPassword = bcrypt.hashSync(
      changePasswordDto.newPassword,
      10,
    );
    return this.adminRepository.update(adminId, {
      password: hashedNewPassword,
    });
  }

  private getAdminRolesPermissions(admin: {
    roles: AdminRole[];
    id: string;
    email: string;
    phone: string;
    name: string;
    password: string;
    isActive: boolean;
    avatarUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
  }) {
    const permissions: { id: string; name: string }[] = [];
    const roles: { id: string; name: string }[] = [];

    admin.roles?.map(
      (
        ar: AdminRole & {
          role: Role & {
            permissions: (RolePermission & {
              permission: Permission;
            })[];
          };
        },
      ) => {
        roles.push({
          id: ar.role.id,
          name: ar.role.name,
        });
        ar.role.permissions?.map((rp) => {
          permissions.push({
            id: rp.permission.id,
            name: rp.permission.name,
          });
        });
      },
    );

    return { roles, permissions };
  }
}
