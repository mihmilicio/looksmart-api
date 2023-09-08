import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { ClothingItemsService } from './clothing-items.service';
import { CreateClothingItemDto } from './dto/create-clothing-item.dto';
import { UpdateClothingItemDto } from './dto/update-clothing-item.dto';

@Controller('clothing-items')
export class ClothingItemsController {
  constructor(private readonly clothingItemsService: ClothingItemsService) {}

  @Post()
  create(@Body() createClothingItemDto: CreateClothingItemDto) {
    return this.clothingItemsService.create(createClothingItemDto);
  }

  @Get()
  findAll() {
    return this.clothingItemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clothingItemsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateClothingItemDto: UpdateClothingItemDto,
  ) {
    return this.clothingItemsService.update(id, updateClothingItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clothingItemsService.remove(id);
  }
}
