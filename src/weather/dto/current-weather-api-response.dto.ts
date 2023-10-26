export class CurrentWeatherApiResponseDto {
  location: {
    name: string;
  };
  current: {
    last_updated_epoch: number;
    temp_c: number;
  };
}
