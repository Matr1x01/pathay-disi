import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerRepository } from './customer.repository';
import { CustomerResponseDto } from './dto/customer-response.dto';
import {
  serialize,
  serializePaginated,
} from '../../common/utils/serialize.util';

@Injectable()
export class CustomerService {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async create(createCustomerDto: CreateCustomerDto) {
    const emailExists = await this.customerRepository.findByEmail(
      createCustomerDto.email,
    );
    if (emailExists) throw new ConflictException('Email already exists');

    if (createCustomerDto.phone) {
      const phoneExists = await this.customerRepository.findByPhone(
        createCustomerDto.phone,
      );
      if (phoneExists) throw new ConflictException('Phone already exists');
    }

    return serialize(
      CustomerResponseDto,
      await this.customerRepository.create(createCustomerDto),
    );
  }

  async findAll(
    page: number = 1,
    perPage: number = 10,
    search?: string,
    sortBy?: string,
    direction: 'asc' | 'desc' = 'asc',
    status?: string,
  ) {
    const customers = await this.customerRepository.findAll(
      page,
      perPage,
      search,
      sortBy,
      direction,
      status,
    );

    return serializePaginated(CustomerResponseDto, customers);
  }

  async findOne(id: string) {
    const customer = await this.customerRepository.findOne(id);
    if (!customer) {
      throw new NotFoundException(`Customer with ID "${id}" not found`);
    }
    return serialize(CustomerResponseDto, customer);
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    await this.findOne(id); // check if exists

    if (updateCustomerDto.email) {
      const emailExists = await this.customerRepository.findByEmail(
        updateCustomerDto.email,
      );
      if (emailExists && emailExists.id !== id)
        throw new ConflictException('Email already exists');
    }

    if (updateCustomerDto.phone) {
      const phoneExists = await this.customerRepository.findByPhone(
        updateCustomerDto.phone,
      );
      if (phoneExists && phoneExists.id !== id)
        throw new ConflictException('Phone already exists');
    }

    return serialize(
      CustomerResponseDto,
      await this.customerRepository.update(id, updateCustomerDto),
    );
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.customerRepository.remove(id);
  }
}
