import { Test, TestingModule } from '@nestjs/testing';
import { BlueprintsService } from './blueprints.service';
import { Blueprint } from './entities/blueprint.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateBlueprintDto } from './dto/create-blueprint.dto';
import { UpdateBlueprintDto } from './dto/update-blueprint.dto';


const mockBlueprint: Blueprint = {
  id: 1,
  name: 'Sample Blueprint',
  version: '1.0.0',
  author: 'John Doe',
  blueprint_data: { components: [] },
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('BlueprintsService', () => {
  let service: BlueprintsService;
  let repository: jest.Mocked<Repository<Blueprint>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlueprintsService,
        {
          provide: getRepositoryToken(Blueprint),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
            createQueryBuilder: jest.fn(() => ({
              andWhere: jest.fn().mockReturnThis(),
              getMany: jest.fn().mockResolvedValue([mockBlueprint]),
            })),
          },
        },
      ],
    }).compile();

    service = module.get(BlueprintsService);
    repository = module.get(getRepositoryToken(Blueprint));
  });

  describe('create', () => {
    it('should create and save a blueprint', async () => {
      const dto: CreateBlueprintDto = {
        name: 'Test Blueprint',
        author: 'John',
        version: '1.0.1',
        blueprint_data: { data: true },
      };

      const created = { ...mockBlueprint, ...dto };
      repository.create.mockReturnValue(created);
      repository.save.mockResolvedValue(created);

      const result = await service.create(dto);
      expect(result).toEqual(created);
      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(repository.save).toHaveBeenCalledWith(created);
    });
  });

  describe('findAll', () => {
    it('should return a list of blueprints without filters', async () => {
      const qb = repository.createQueryBuilder();
      const result = await service.findAll();
      expect(result).toEqual([mockBlueprint]);
    });
  });

  describe('findOne', () => {
    it('should return a blueprint if found', async () => {
      repository.findOne.mockResolvedValue(mockBlueprint);
      const result = await service.findOne(1);
      expect(result).toEqual(mockBlueprint);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException if not found', async () => {
      repository.findOne.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return the blueprint', async () => {
      const updateDto: UpdateBlueprintDto = { name: 'Updated Name' };
      const updated = { ...mockBlueprint, ...updateDto };

      repository.findOne.mockResolvedValue(mockBlueprint);
      repository.save.mockResolvedValue(updated);

      const result = await service.update(1, updateDto);
      expect(result).toEqual(updated);
      expect(repository.save).toHaveBeenCalledWith(updated);
    });

    it('should throw NotFoundException if blueprint not found', async () => {
      repository.findOne.mockResolvedValue(null);
      await expect(service.update(999, { name: 'X' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove the blueprint successfully', async () => {
        repository.delete.mockResolvedValue({ affected: 1, raw: {} });


      await service.remove(1);
      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if nothing deleted', async () => {
        repository.delete.mockResolvedValue({ affected: 0, raw: {} });

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
