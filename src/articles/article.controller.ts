import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Put,
  Body,
  Post,
} from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { DefaultExceptionDto } from 'src/exceptions/default-exception.dto';
import { ArticleService } from './article.service';
import { ArticleDto } from './dto/article.dto';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post('')
  @ApiNotFoundResponse({
    type: DefaultExceptionDto,
  })
  @ApiInternalServerErrorResponse({
    type: DefaultExceptionDto,
  })
  async create(@Body() dto: ArticleDto) {
    try {
      return await this.articleService.create(dto);
    } catch (err) {
      console.error(err);

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
  async update(@Param('id') id: string, @Body() dto: ArticleDto) {
    try {
      if (await this.findOne(id)) {
        return await this.articleService.update(id, dto);
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

  @Get()
  @ApiInternalServerErrorResponse({
    type: DefaultExceptionDto,
  })
  findAll() {
    try {
      return this.articleService.findAll();
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
  async findOne(@Param('id') id: string) {
    try {
      const article = await this.articleService.findOne(id);

      if (article) {
        return article;
      }

      throw new NotFoundException('Artigo não encontrado.');
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
