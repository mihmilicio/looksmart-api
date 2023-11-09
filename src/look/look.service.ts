import { ClothingItemsService } from 'src/clothing-items/clothing-items.service';
import { Injectable } from '@nestjs/common';
import { LookDto } from './dto/look.dto';
import { ClothingItemCategoryEnum } from 'src/clothing-items/clothing-item-category.enum';
import { LookAvailabilityDto } from './dto/look-availability.dto';
import { LookHistory } from './entities/look-history';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LookHistoryDto } from './dto/look-history.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class LookService {
  constructor(
    private readonly clothingItemsService: ClothingItemsService,
    @InjectRepository(LookHistory)
    private lookHistoryRepository: Repository<LookHistory>,
  ) {}

  async generate(
    usage: string,
    season: string,
    topId: string,
    bottomId: string,
    footwearId: string,
    userId: string,
  ): Promise<LookDto> {
    const promiseTop = !!topId
      ? this.clothingItemsService.findOne(topId, userId)
      : this.clothingItemsService.chooseOneInCategory(
          ClothingItemCategoryEnum.Top,
          usage,
          season,
          userId,
        );
    const promiseBottom = !!bottomId
      ? this.clothingItemsService.findOne(bottomId, userId)
      : this.clothingItemsService.chooseOneInCategory(
          ClothingItemCategoryEnum.Bottom,
          usage,
          season,
          userId,
        );
    const promiseFootwear = !!footwearId
      ? this.clothingItemsService.findOne(footwearId, userId)
      : this.clothingItemsService.chooseOneInCategory(
          ClothingItemCategoryEnum.Footwear,
          usage,
          season,
          userId,
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

  async checkLookAvailability(userId: string): Promise<LookAvailabilityDto> {
    const promiseTop = this.clothingItemsService.countItemsOfType(
      ClothingItemCategoryEnum.Top,
      userId,
    );
    const promiseBottom = this.clothingItemsService.countItemsOfType(
      ClothingItemCategoryEnum.Bottom,
      userId,
    );
    const promiseFootwear = this.clothingItemsService.countItemsOfType(
      ClothingItemCategoryEnum.Footwear,
      userId,
    );

    const countings = await Promise.all([
      promiseTop,
      promiseBottom,
      promiseFootwear,
    ]);

    const available = countings.every((count) => count > 0);

    return { available };
  }

  async addToHistory(
    lookHistoryDto: LookHistoryDto,
    userId: string,
  ): Promise<LookHistory> {
    return this.lookHistoryRepository.save(<LookHistory>{
      id: uuid(),
      userId,
      ...lookHistoryDto,
    });
  }

  getHistory(userId: string): Promise<LookHistoryDto[]> {
    return this.lookHistoryRepository
      .find({
        order: { createdDate: 'DESC' },
        where: { userId },
      })
      .then(
        (result) =>
          result?.map(
            (item) =>
              <LookHistoryDto>{
                usage: item.usage,
                season: item.season,
                topImage: item.topImage,
                bottomImage: item.bottomImage,
                footwearImage: item.footwearImage,
                lowConfiability: item.lowConfiability,
                createdDate: item.createdDate,
              },
          ),
      );
  }
}
