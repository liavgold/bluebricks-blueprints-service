import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { BlueprintsService } from './blueprints.service';
import { CreateBlueprintDto } from './dto/create-blueprint.dto';
import { UpdateBlueprintDto } from './dto/update-blueprint.dto';
import { Blueprint } from './entities/blueprint.entity';

@Controller('api/v1/blueprints')
export class BlueprintsController {
  constructor(private readonly blueprintsService: BlueprintsService) {}

  @Post()
  create(@Body() createDto: CreateBlueprintDto): Promise<Blueprint> {
    return this.blueprintsService.create(createDto);
  }

  @Get()
  findAll(
    @Query('version') version?: string,
    @Query('author') author?: string,
  ): Promise<Blueprint[]> {
    return this.blueprintsService.findAll({ version, author });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Blueprint> {
    return this.blueprintsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateBlueprintDto,
  ): Promise<Blueprint> {
    return this.blueprintsService.update(id, updateDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.blueprintsService.remove(id);
  }
}
