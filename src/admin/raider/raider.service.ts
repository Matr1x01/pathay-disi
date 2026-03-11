import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRaiderDto } from './dto/create-raider.dto';
import { UpdateRaiderDto } from './dto/update-raider.dto';
import { RaiderRepository } from './raider.repository';
import { RaiderResponseDto } from './dto/raider-response.dto';
import {
  serialize,
  serializePaginated,
} from '../../common/utils/serialize.util';

@Injectable()
export class RaiderService {
  constructor(private readonly raiderRepository: RaiderRepository) {}

  async create(createRaiderDto: CreateRaiderDto) {
    const emailExists = await this.raiderRepository.findByEmail(
      createRaiderDto.email,
    );
    if (emailExists) throw new ConflictException('Email already in use');

    const phoneExists = await this.raiderRepository.findByPhone(
      createRaiderDto.phone,
    );
    if (phoneExists) throw new ConflictException('Phone already in use');

    return serialize(
      RaiderResponseDto,
      await this.raiderRepository.create(createRaiderDto),
    );
  }

  async findAll(
    page: number = 1,
    perPage: number = 10,
    search?: string,
    sortBy?: string,
    direction: 'asc' | 'desc' = 'asc',
    isOnline?: string,
  ) {
    const raiders = await this.raiderRepository.findAll(
      page,
      perPage,
      search,
      sortBy,
      direction,
      isOnline,
    );
    return serializePaginated(RaiderResponseDto, raiders);
  }

  async findOne(id: string) {
    const raider = await this.raiderRepository.findOne(id);
    if (!raider)
      throw new NotFoundException(`Raider with ID "${id}" not found`);
    return serialize(RaiderResponseDto, raider);
  }

  async update(id: string, updateRaiderDto: UpdateRaiderDto) {
    await this.findOne(id);

    if (updateRaiderDto.email) {
      const emailExists = await this.raiderRepository.findByEmail(
        updateRaiderDto.email,
      );
      if (emailExists && emailExists.id !== id)
        throw new ConflictException('Email already in use');
    }

    if (updateRaiderDto.phone) {
      const phoneExists = await this.raiderRepository.findByPhone(
        updateRaiderDto.phone,
      );
      if (phoneExists && phoneExists.id !== id)
        throw new ConflictException('Phone already in use');
    }

    return serialize(
      RaiderResponseDto,
      await this.raiderRepository.update(id, updateRaiderDto),
    );
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.raiderRepository.remove(id);
  }
}
