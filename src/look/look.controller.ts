import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
  Request,
} from '@nestjs/common';
import { LookService } from './look.service';

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

      const look = await this.lookService.generate(
        usage,
        season,
        top,
        bottom,
        footwear,
        req.user.userId,
      );

      if (look.top == null || look.bottom == null || look.footwear == null) {
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
}
