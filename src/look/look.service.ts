import { ClothingItemsService } from 'src/clothing-items/clothing-items.service';
import { Injectable } from '@nestjs/common';
import { LookDto } from './dto/look.dto';
import { ClothingItemCategoryEnum } from 'src/clothing-items/clothing-item-category.enum';

@Injectable()
export class LookService {
  constructor(private readonly clothingItemsService: ClothingItemsService) {}

  async generate(usage: string, season: string): Promise<LookDto> {
    const promiseTop = this.clothingItemsService.chooseOneInCategory(
      ClothingItemCategoryEnum.Top,
    );
    const promiseBottom = this.clothingItemsService.chooseOneInCategory(
      ClothingItemCategoryEnum.Bottom,
    );
    const promiseFootwear = this.clothingItemsService.chooseOneInCategory(
      ClothingItemCategoryEnum.Footwear,
    );

    const [top, bottom, footwear] = await Promise.all([
      promiseTop,
      promiseBottom,
      promiseFootwear,
    ]);

    return {
      usage,
      season,
      lowConfiability: false,
      top,
      bottom,
      footwear,
    };
  }
}
