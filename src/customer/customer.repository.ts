import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { getDiff } from '../common/utils/object-diff.util';
import { Customer, CustomerStatus } from '@prisma/client';

@Injectable()
export class CustomerRepository {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<Customer | null> {
    return this.prisma.customer.findUnique({
      where: { email },
    });
  }

  async findActiveByEmail(email: string): Promise<Customer | null> {
    return this.prisma.customer.findFirst({
      where: { email, status: CustomerStatus.ACTIVE },
    });
  }

  async findById(id: string): Promise<Customer | null> {
    return this.prisma.customer.findUnique({
      where: { id },
    });
  }

  async createCustomer(createCustomer: {
    name: string;
    email: string;
    phone?: string | null;
    password: string;
  }) {
    return this.prisma.customer.create({
      data: { ...createCustomer, status: CustomerStatus.PENDING },
      select: { id: true, name: true, email: true, phone: true },
    });
  }

  async markEmailAsVerified(id: string) {
    return this.prisma.customer.update({
      where: { id },
      data: { status: CustomerStatus.ACTIVE },
      select: { id: true, name: true, email: true, phone: true },
    });
  }

  async updateCustomer(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
    currentCustomerData: Customer,
  ) {
    const dataToUpdate = getDiff(currentCustomerData, {
      name: updateCustomerDto.name,
      email: updateCustomerDto.email,
      phone: updateCustomerDto.phone_number,
    });

    if (Object.keys(dataToUpdate).length === 0) {
      const { id, name, email, phone } = currentCustomerData;
      return { id, name, email, phone };
    }

    return this.prisma.customer.update({
      where: { id },
      data: dataToUpdate,
      select: { id: true, name: true, email: true, phone: true },
    });
  }
}
