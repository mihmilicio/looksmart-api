import { Injectable } from '@nestjs/common';
import { UpdateClothingItemDto } from './dto/update-clothing-item.dto';
import { ClothingItem } from './entities/clothing-item.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { v4 as uuid } from 'uuid';
import { AiService } from 'src/ai/ai.service';
import { ClothingItemCategoryEnum } from './clothing-item-category.enum';
import { ClothingItemClassificationDto } from 'src/ai/dto/clothing-item-classification.dto';

@Injectable()
export class ClothingItemsService {
  constructor(
    @InjectRepository(ClothingItem)
    private clothingItemsRepository: Repository<ClothingItem>,
    private readonly fileUploadService: FileUploadService,
    private readonly aiService: AiService,
  ) {}

  async create(image: Express.Multer.File): Promise<ClothingItem> {
    const id = uuid();
    const ext = image.originalname.split('.').pop();
    const filename = `${id}.${ext}`;

    await this.fileUploadService.uploadFile(
      image.buffer,
      `${process.env.IMAGES_DIR}/${filename}`,
    );

    const skipAI = process.env.SKIP_AI_SERVICE === 'true';

    let predicted: ClothingItemClassificationDto;
    if (!skipAI) {
      predicted = await this.aiService.classifyClothingItem(filename);
    }

    const imagePath = skipAI
      ? `${process.env.IMAGES_DIR}/${filename}`
      : `${process.env.IMAGES_NO_BG_DIR}/${id}.png`;

    const saved = await this.clothingItemsRepository.save({
      id,
      image: process.env.STORAGE_URL + imagePath,
      description: skipAI ? 'Não identificado' : predicted.description,
    });

    return {
      id: saved.id,
      image: saved.image,
      type: skipAI ? 'cima' : predicted.type,
      season: skipAI ? 'meia-estacao' : predicted.season,
      usage: skipAI ? 'casual' : predicted.usage,
      description: saved.description,
      createdDate: saved.createdDate,
      updatedDate: saved.updatedDate,
    };
  }

  findAll(): Promise<ClothingItem[]> {
    return this.clothingItemsRepository.find({
      order: { createdDate: 'DESC' },
    });
  }

  findOne(id: string): Promise<ClothingItem | null> {
    return this.clothingItemsRepository.findOneBy({ id });
  }

  async update(
    id: string,
    updateClothingItemDto: UpdateClothingItemDto,
  ): Promise<ClothingItem> {
    const clothingItem = new ClothingItem();
    clothingItem.season = updateClothingItemDto.season;
    clothingItem.type = updateClothingItemDto.type;
    clothingItem.usage = updateClothingItemDto.usage;
    clothingItem.description = updateClothingItemDto.description;
    await this.clothingItemsRepository.update({ id }, clothingItem);
    return this.clothingItemsRepository.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.clothingItemsRepository.delete(id);
  }

  chooseOneInCategory(
    category: ClothingItemCategoryEnum,
    usage: string,
    season: string,
  ): Promise<ClothingItem | null> {
    return this.clothingItemsRepository
      .createQueryBuilder('clothing-item')
      .select([
        'clothing-item.id',
        'clothing-item.image',
        'clothing-item.usage',
        'clothing-item.season',
      ])
      .where(
        `(clothing-item.type = :type AND clothing-item.usage = :usage AND clothing-item.season = :season) OR (clothing-item.type = :type)`,
        {
          type: category,
          usage,
          season,
        },
      )
      .orderBy('RANDOM()')
      .getOne();
  }

  countItemsOfType(category: ClothingItemCategoryEnum): Promise<number> {
    return this.clothingItemsRepository
      .createQueryBuilder('clothing-item')
      .select(['clothing-item.id'])
      .where(`clothing-item.type = :type`, {
        type: category,
      })
      .getCount();
  }
}
