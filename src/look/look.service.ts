import { ClothingItemsService } from 'src/clothing-items/clothing-items.service';
import { Injectable } from '@nestjs/common';
import { LookDto } from './dto/look.dto';
import { ClothingItemCategoryEnum } from 'src/clothing-items/clothing-item-category.enum';
import { LookAvailabilityDto } from './dto/look-availability.dto';

@Injectable()
export class LookService {
  constructor(private readonly clothingItemsService: ClothingItemsService) {}

  async generate(
    usage: string,
    season: string,
    topId: string,
    bottomId: string,
    footwearId: string,
  ): Promise<LookDto> {
    const promiseTop = !!topId
      ? this.clothingItemsService.findOne(topId)
      : this.clothingItemsService.chooseOneInCategory(
          ClothingItemCategoryEnum.Top,
          usage,
          season,
        );
    const promiseBottom = !!bottomId
      ? this.clothingItemsService.findOne(bottomId)
      : this.clothingItemsService.chooseOneInCategory(
          ClothingItemCategoryEnum.Bottom,
          usage,
          season,
        );
    const promiseFootwear = !!footwearId
      ? this.clothingItemsService.findOne(footwearId)
      : this.clothingItemsService.chooseOneInCategory(
          ClothingItemCategoryEnum.Footwear,
          usage,
          season,
        );

    const pecas = await Promise.all([
      promiseTop,
      promiseBottom,
      promiseFootwear,
    ]);

    const lowConfiability = pecas.some(
      (peca) => peca.usage != usage || peca.season != season,
    );

    const [top, bottom, footwear] = pecas;

    return {
      usage,
      season,
      lowConfiability,
      top,
      bottom,
      footwear,
    };
  }

  async checkLookAvailability(): Promise<LookAvailabilityDto> {
    const promiseTop = this.clothingItemsService.countItemsOfType(
      ClothingItemCategoryEnum.Top,
    );
    const promiseBottom = this.clothingItemsService.countItemsOfType(
      ClothingItemCategoryEnum.Bottom,
    );
    const promiseFootwear = this.clothingItemsService.countItemsOfType(
      ClothingItemCategoryEnum.Footwear,
    );

    const countings = await Promise.all([
      promiseTop,
      promiseBottom,
      promiseFootwear,
    ]);

    const available = countings.every((count) => count > 0);

    return { available };
  }
}
