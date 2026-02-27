import { BadRequestException, Injectable } from '@nestjs/common';
import { IUser } from 'src/common/interfaces/user.interface';
import { AdminRepository } from './admin.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AppCacheService } from '../app-cache/app-cache.service';

@Injectable()
export class AdminService {
  constructor(
    private jwtService: JwtService,
    private appCache: AppCacheService,
    private adminRepository: AdminRepository,
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

  async getProfile(adminId: string): Promise<IUser> {
    const admin = await this.adminRepository.findById(adminId);
    if (!admin) {
      throw new BadRequestException('Admin not found');
    }
    return {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      type: 'admin',
    };
  }
  // to find and validate admin users.
  async validateUser(adminId: string): Promise<IUser | null> {
    const admin = await this.adminRepository.findById(adminId);
    if (admin) {
      return {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        type: 'admin',
      };
    }
    return null;
  }
}
