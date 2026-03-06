import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { CustomerService } from 'src/customer/customer.service';
import { IUser } from 'src/common/interfaces/user.interface';
import { AdminService } from '../../admin/admin.service'; // Import IUser

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private customerService: CustomerService, // Renamed for clarity
    private adminService: AdminService, // Future: Inject AdminService
    // private raiderService: RaiderService, // Future: Inject RaiderService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'super-secret-key-change-me-2026', // Ensure it's a string
    });
  }

  async validate(payload: any): Promise<IUser> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { id, type } = payload;

    if (!(id && type)) {
      throw new UnauthorizedException('Invalid JWT payload');
    }

    let user: IUser | null = null;

    if (type == 'customer') {
      const customer = await this.customerService.validateUser(id);
      if (customer) {
        user = customer;
      }
    } else if (type == 'admin') {
      const admin = await this.adminService.validateUser(id);
      if (admin) {
        user = admin;
      }
    } else {
      throw new UnauthorizedException('Unknown user type');
    }

    if (!user) {
      throw new UnauthorizedException('User not found or invalid');
    }
    return user; // this attaches to req.user
  }
}
