import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { LookService } from './look.service';
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { DefaultExceptionDto } from 'src/exceptions/default-exception.dto';
import { LookHistoryDto } from './dto/look-history.dto';
import { LookDto } from './dto/look.dto';

@Controller('look')
export class LookController {
  constructor(private readonly lookService: LookService) {}

  @Get()
  async generate(
    @Query('season') season: string,
    @Query('usage') usage: string,
    @Query('top') top: string,
    @Query('bottom') bottom: string,
    @Query('footwear') footwear: string,
    @Request() req,
  ) {
    season = season || 'meia-estacao';
    usage = usage || 'casual';

    try {
      const lookAvailability = await this.lookService.checkLookAvailability(
        req.user.userId,
      );

      if (!lookAvailability.available) {
        throw new HttpException(
          'Não existem peças para formar um look',
          HttpStatus.FAILED_DEPENDENCY,
        );
      }

      let look: LookDto;

      if (process.env.SKIP_AI_SERVICE === 'true') {
        look = await this.lookService.generateRandom(
          usage,
          season,
          top,
          bottom,
          footwear,
          req.user.userId,
        );
      } else {
        look = await this.lookService.generate(
          usage,
          season,
          top,
          bottom,
          footwear,
          req.user.userId,
        );
      }

      if (!look.top?.id || !look.bottom?.id || !look.footwear?.id) {
        throw new HttpException(
          'Não existem peças para formar um look',
          HttpStatus.FAILED_DEPENDENCY,
        );
      }

      if (
        (!!top && look.top == null) ||
        (!!bottom && look.bottom == null) ||
        (!!footwear && look.footwear == null)
      ) {
        throw new HttpException(
          'Peça selecionada não encontrada',
          HttpStatus.BAD_REQUEST,
        );
      }

      return look;
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }

      throw new HttpException(
        'Algo de errado aconteceu. Tente novamente',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('availability')
  async checkLookAvailability(@Request() req) {
    try {
      return this.lookService.checkLookAvailability(req.user.userId);
    } catch (err) {
      console.log(err);
      throw new HttpException(
        'Algo de errado aconteceu. Tente novamente',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('history')
  @ApiInternalServerErrorResponse({
    type: DefaultExceptionDto,
  })
  getHistory(@Request() req) {
    try {
      return this.lookService.getHistory(req.user.userId);
    } catch (err) {
      console.error(err);
      throw new HttpException(
        'Algo de errado aconteceu. Tente novamente',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('history')
  @ApiNotFoundResponse({
    type: DefaultExceptionDto,
  })
  @ApiInternalServerErrorResponse({
    type: DefaultExceptionDto,
  })
  async addToHistory(@Body() lookHistoryDto: LookHistoryDto, @Request() req) {
    try {
      return await this.lookService.addToHistory(
        lookHistoryDto,
        req.user.userId,
      );
    } catch (err) {
      console.error(err);
      throw new HttpException(
        'Algo de errado aconteceu. Tente novamente',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
