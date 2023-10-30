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
  HttpCode,
  Request,
} from '@nestjs/common';
import { ClothingItemsService } from './clothing-items.service';
import { UpdateClothingItemDto } from './dto/update-clothing-item.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import {
  ApiBody,
  ApiConsumes,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { DefaultExceptionDto } from 'src/exceptions/default-exception.dto';
import { AxiosError } from 'axios';

@ApiTags('clothing-items')
@Controller('clothing-items')
export class ClothingItemsController {
  constructor(private readonly clothingItemsService: ClothingItemsService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiUnprocessableEntityResponse({
    type: DefaultExceptionDto,
    description: 'Clothing item not recognized in the image',
  })
  @ApiInternalServerErrorResponse({
    type: DefaultExceptionDto,
  })
  @UseInterceptors(FileInterceptor('image'))
  create(@UploadedFile() image: Express.Multer.File, @Request() req) {
    try {
      return this.clothingItemsService.create(image, req.user.userId);
    } catch (err) {
      console.error(err);
      if (err instanceof FileUploadFailedException) {
        throw new HttpException(
          'Não foi possível fazer o upload da imagem',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      if (err instanceof AxiosError) {
        throw new HttpException(
          'Erro ao classificar a classificar a peça',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }

      throw new HttpException(
        'Algo de errado aconteceu. Tente novamente',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @ApiInternalServerErrorResponse({
    type: DefaultExceptionDto,
  })
  findAll(@Request() req) {
    try {
      return this.clothingItemsService.findAll(req.user.userId);
    } catch (err) {
      console.error(err);
      throw new HttpException(
        'Algo de errado aconteceu. Tente novamente',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiNotFoundResponse({
    type: DefaultExceptionDto,
  })
  @ApiInternalServerErrorResponse({
    type: DefaultExceptionDto,
  })
  async findOne(@Param('id') id: string, @Request() req) {
    try {
      const clothingItem = await this.clothingItemsService.findOne(
        id,
        req.user.userId,
      );

      if (clothingItem) {
        return clothingItem;
      }

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
  @ApiNotFoundResponse({
    type: DefaultExceptionDto,
  })
  @ApiInternalServerErrorResponse({
    type: DefaultExceptionDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateClothingItemDto: UpdateClothingItemDto,
    @Request() req,
  ) {
    try {
      if (await this.findOne(id, req)) {
        return await this.clothingItemsService.update(
          id,
          updateClothingItemDto,
        );
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
  @HttpCode(204)
  @ApiNotFoundResponse({
    type: DefaultExceptionDto,
  })
  @ApiInternalServerErrorResponse({
    type: DefaultExceptionDto,
  })
  async remove(@Param('id') id: string, @Request() req) {
    try {
      if (await this.findOne(id, req)) {
        return await this.clothingItemsService.remove(id, req.user.userId);
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
