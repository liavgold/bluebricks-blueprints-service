import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blueprint } from './entities/blueprint.entity';
import { CreateBlueprintDto } from './dto/create-blueprint.dto';
import { UpdateBlueprintDto } from './dto/update-blueprint.dto';

@Injectable()
export class BlueprintsService {
  constructor(
    @InjectRepository(Blueprint)
    private readonly blueprintRepository: Repository<Blueprint>,
  ) {}

  async create(createDto: CreateBlueprintDto): Promise<Blueprint> {
    const blueprint = this.blueprintRepository.create(createDto);
    return this.blueprintRepository.save(blueprint);
  }

  async findAll(filters?: { version?: string; author?: string }): Promise<Blueprint[]> {
    const query = this.blueprintRepository.createQueryBuilder('blueprint');

    if (filters?.version) {
      query.andWhere('blueprint.version = :version', { version: filters.version });
    }

    if (filters?.author) {
      query.andWhere('blueprint.author = :author', { author: filters.author });
    }

    return query.getMany();
  }

  async findOne(id: number): Promise<Blueprint> {
    const blueprint = await this.blueprintRepository.findOne({ where: { id } });
    if (!blueprint) {
      throw new NotFoundException(`Blueprint with ID ${id} not found`);
    }
    return blueprint;
  }

  async update(id: number, updateDto: UpdateBlueprintDto): Promise<Blueprint> {
    const blueprint = await this.findOne(id);
    Object.assign(blueprint, updateDto);
    return this.blueprintRepository.save(blueprint);
  }

  async remove(id: number): Promise<void> {
    const result = await this.blueprintRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Blueprint with ID ${id} not found`);
    }
  }
}
