import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ClothingItemClassificationDto } from './dto/clothing-item-classification.dto';

@Injectable()
export class AiService {
  constructor(private readonly httpService: HttpService) {}

  async classifyClothingItem(
    image: Express.Multer.File,
  ): Promise<ClothingItemClassificationDto> {
    const { data } = await firstValueFrom(
      this.httpService.post(
        `${process.env.IA_BASE_URL}/api/Classify`,
        image.buffer,
        { headers: { 'Content-Type': image.mimetype } },
      ),
    );

    return data;
  }
}
