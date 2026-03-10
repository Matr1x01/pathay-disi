import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { paginate } from '../../common/utils/prisma-pagination';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CustomerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCustomerDto: CreateCustomerDto) {
    const hashedPassword = await bcrypt.hash(createCustomerDto.password, 10);
    return this.prisma.customer.create({
      data: {
        name: createCustomerDto.name,
        email: createCustomerDto.email,
        phone: createCustomerDto.phone,
        password: hashedPassword,
        status: createCustomerDto.status,
      },
    });
  }

  async findAll(
    page: number = 1,
    perPage: number = 10,
    search?: string,
    sortBy?: string,
    direction: 'asc' | 'desc' = 'asc',
    status?: string,
  ) {
    const where = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(status && { status: status as any }),
      deletedAt: null, // exclude soft deleted
    };

    return paginate(
      this.prisma.customer,
      { page, perPage },
      {
        where,
        orderBy: sortBy ? { [sortBy]: direction } : undefined,
      },
    );
  }

  async findOne(id: string) {
    return this.prisma.customer.findUnique({
      where: { id, deletedAt: null },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.customer.findUnique({
      where: { email },
    });
  }

  async findByPhone(phone: string) {
    return this.prisma.customer.findUnique({
      where: { phone },
    });
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    const data: any = { ...updateCustomerDto };
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return this.prisma.customer.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.customer.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
