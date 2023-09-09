import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ClothingItemsService } from './clothing-items.service';
import { UpdateClothingItemDto } from './dto/update-clothing-item.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

@Controller('clothing-items')
export class ClothingItemsController {
  constructor(private readonly clothingItemsService: ClothingItemsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(@UploadedFile() image: Express.Multer.File) {
    return this.clothingItemsService.create(image);
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
