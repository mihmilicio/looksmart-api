import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { LocationService } from './location.service';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get('search')
  async searchLocation(@Query('query') query: string) {
    try {
      if (!query?.trim?.()?.length) {
        throw new HttpException(
          'O parâmetro "query" é obrigatório',
          HttpStatus.BAD_REQUEST,
        );
      }

      return await this.locationService.search(query);
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
}
