import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get('current')
  async getCurrentWeather(@Query('location') location: string) {
    try {
      if (!location?.trim?.()?.length) {
        throw new HttpException(
          'O parâmetro "location" é obrigatório',
          HttpStatus.BAD_REQUEST,
        );
      }

      return await this.weatherService.getCurrentWeather(location);
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
