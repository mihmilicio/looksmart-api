import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom, map } from 'rxjs';
import { LocationDto } from './dto/location.dto';
import { LocationApiResponseDto } from './dto/location-api-response.dto';

@Injectable()
export class LocationService {
  constructor(private readonly httpService: HttpService) {}

  async search(query: string): Promise<LocationDto[]> {
    const url = `${process.env.WEATHER_BASE_URL}/search.json?key=${process.env.WEATHER_API_KEY}&q=${query}`;
    return await firstValueFrom(
      this.httpService.get<LocationApiResponseDto[]>(url).pipe(
        map((response) => {
          return response.data?.map((item) => {
            return <LocationDto>{
              name: `${item.name}, ${item.region}, ${item.country}`,
              url: item.url,
            };
          });
        }),
      ),
    );
  }
}
