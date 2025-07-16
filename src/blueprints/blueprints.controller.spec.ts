import { Test, TestingModule } from '@nestjs/testing';
import { BlueprintsController } from './blueprints.controller';
import { BlueprintsService } from './blueprints.service';
import { CreateBlueprintDto } from './dto/create-blueprint.dto';
import { UpdateBlueprintDto } from './dto/update-blueprint.dto';
import { Blueprint } from './entities/blueprint.entity';

const mockBlueprint: Blueprint = {
    id: 1,
    name: 'Test Blueprint',
    author: 'John Doe',
    version: '1.0.0',
    createdAt: new Date(),
    updatedAt: new Date(),
    blueprint_data: undefined
};

describe('BlueprintsController', () => {
  let controller: BlueprintsController;
  let service: jest.Mocked<BlueprintsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlueprintsController],
      providers: [
        {
          provide: BlueprintsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get(BlueprintsController);
    service = module.get(BlueprintsService);
  });

  describe('create()', () => {
    it('should create and return a blueprint', async () => {
      const dto: CreateBlueprintDto = {
          name: 'New Blueprint', author: 'Jane', version: '1.2.3',
          blueprint_data: undefined
      };
      service.create.mockResolvedValue({ ...mockBlueprint, ...dto });

      const result = await controller.create(dto);
      expect(result).toEqual({ ...mockBlueprint, ...dto });
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll()', () => {
    it('should return an array of blueprints', async () => {
      service.findAll.mockResolvedValue([mockBlueprint]);

      const result = await controller.findAll();
      expect(result).toEqual([mockBlueprint]);
      expect(service.findAll).toHaveBeenCalledWith({ version: undefined, author: undefined });
    });

    it('should pass filters to service', async () => {
      const filters = { version: '1.0.0', author: 'John' };
      service.findAll.mockResolvedValue([mockBlueprint]);

      const result = await controller.findAll(filters.version, filters.author);
      expect(service.findAll).toHaveBeenCalledWith(filters);
    });
  });

  describe('findOne()', () => {
    it('should return a blueprint by id', async () => {
      service.findOne.mockResolvedValue(mockBlueprint);

      const result = await controller.findOne(1);
      expect(result).toEqual(mockBlueprint);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update()', () => {
    it('should update and return the blueprint', async () => {
      const dto: UpdateBlueprintDto = { name: 'Updated Blueprint' };
      const updated = { ...mockBlueprint, ...dto };
      service.update.mockResolvedValue(updated);

      const result = await controller.update(1, dto);
      expect(result).toEqual(updated);
      expect(service.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove()', () => {
    it('should call service.remove with the correct id', async () => {
      service.remove.mockResolvedValue(undefined);

      await controller.remove(1);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
