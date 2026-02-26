import { Injectable } from '@nestjs/common';
import { IUser } from 'src/common/interfaces/user.interface';

@Injectable()
export class AdminService {
  // This is a placeholder. In a real application, you would interact with a database
  // to find and validate admin users.
  validateUser(adminId: string): IUser | null {
    // For now, just return a dummy admin user if the ID matches a known one
    if (adminId === 'admin-test-id') {
      return {
        id: 'admin-test-id',
        name: 'Admin User',
        email: 'admin@example.com',
        type: 'admin',
      };
    }
    return null;
  }
}
