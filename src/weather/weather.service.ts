import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom, map } from 'rxjs';
import { CurrentWeatherApiResponseDto } from './dto/current-weather-api-response.dto';
import { CurrentWeatherDto } from './dto/current-weather.dto';

@Injectable()
export class WeatherService {
  constructor(private readonly httpService: HttpService) {}

  async getCurrentWeather(location: string): Promise<CurrentWeatherDto> {
    const url = `${process.env.WEATHER_BASE_URL}/current.json?key=${process.env.WEATHER_API_KEY}&q=${location}&aqi=no`;
    return firstValueFrom(
      this.httpService.get<CurrentWeatherApiResponseDto>(url).pipe(
        map((response) => {
          return <CurrentWeatherDto>{
            location: response.data.location.name,
            temperature: response.data.current.temp_c,
            last_updated: response.data.current.last_updated_epoch,
          };
        }),
      ),
    );
  }
}
