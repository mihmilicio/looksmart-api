import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ClothingItemClassificationDto } from './dto/clothing-item-classification.dto';
import { GenerateLookRequestDto } from './dto/generate-look-request.dto';
import { GenerateLookResponseDto } from './dto/generate-look-response.dto';

@Injectable()
export class AiService {
  constructor(private readonly httpService: HttpService) {}

  async classifyClothingItem(
    filename: string,
  ): Promise<ClothingItemClassificationDto> {
    const url = `${process.env.IA_BASE_URL}/classify?filename=${filename}`;
    const { data } = await firstValueFrom(this.httpService.get(url));
    return data;
  }

  async generateLook(
    dto: GenerateLookRequestDto,
  ): Promise<GenerateLookResponseDto> {
    const url = `${process.env.IA_BASE_URL}/generate-look`;
    const { data } = await firstValueFrom(this.httpService.post(url, dto));
    return data;
  }
}
