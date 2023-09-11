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
  HttpException,
  HttpStatus,
  NotFoundException,
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
    try {
      return this.clothingItemsService.create(image);
    } catch (err) {
      console.error(err);
      if (err instanceof FileUploadFailedException) {
        throw new HttpException(
          'Não foi possível fazer o upload da imagem',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        throw new HttpException(
          'Algo de errado aconteceu. Tente novamente',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Get()
  findAll() {
    try {
      return this.clothingItemsService.findAll();
    } catch (err) {
      console.error(err);
      throw new HttpException(
        'Algo de errado aconteceu. Tente novamente',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const clothingItem = await this.clothingItemsService.findOne(id);

      if (clothingItem) {
        console.log(clothingItem);
        return clothingItem;
      }

      console.log('404');
      throw new NotFoundException('Não encontramos essa peça de roupa...');
    } catch (err) {
      console.error(err);
      if (err instanceof NotFoundException) {
        throw err;
      }

      throw new HttpException(
        'Algo de errado aconteceu. Tente novamente',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateClothingItemDto: UpdateClothingItemDto,
  ) {
    try {
      if (await this.findOne(id)) {
        return this.clothingItemsService.update(id, updateClothingItemDto);
      }
    } catch (err) {
      console.error(err);
      if (err instanceof NotFoundException) {
        throw err;
      }

      throw new HttpException(
        'Algo de errado aconteceu. Tente novamente',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      if (await this.findOne(id)) {
        return this.clothingItemsService.remove(id);
      }
    } catch (err) {
      console.error(err);
      if (err instanceof NotFoundException) {
        throw err;
      }

      throw new HttpException(
        'Algo de errado aconteceu. Tente novamente',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
