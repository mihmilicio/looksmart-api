import { Injectable } from '@nestjs/common';
import { UpdateClothingItemDto } from './dto/update-clothing-item.dto';
import { ClothingItem } from './entities/clothing-item.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { v4 as uuid } from 'uuid';
import { AiService } from 'src/ai/ai.service';
import {
  ClothingItemCategoryEnum,
  clothingItemsInCategory,
} from './clothing-item-category.enum';

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

    const predicted = await this.aiService.classifyClothingItem(filename);

    const saved = await this.clothingItemsRepository.save({
      id,
      image: `${process.env.STORAGE_URL}${process.env.IMAGES_NO_BG_DIR}/${filename}`,
    });

    return {
      id: saved.id,
      image: saved.image,
      type: predicted.type,
      season: predicted.season,
      usage: predicted.usage,
    };
  }

  findAll(): Promise<ClothingItem[]> {
    return this.clothingItemsRepository.find();
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
    await this.clothingItemsRepository.update({ id }, clothingItem);
    return this.clothingItemsRepository.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.clothingItemsRepository.delete(id);
  }

  chooseOneInCategory(
    category: ClothingItemCategoryEnum,
  ): Promise<ClothingItem | null> {
    const typesInCategory = clothingItemsInCategory(category);

    this.clothingItemsRepository
      .createQueryBuilder('clothing-item')
      .select()
      .where(`clothing-item.type in (${typesInCategory.join(',')})`)
      .orderBy('RANDOM()')
      .printSql();

    return this.clothingItemsRepository
      .createQueryBuilder('clothing-item')
      .select()
      .where(
        `clothing-item.type in (${typesInCategory
          .map((type) => `'${type}'`)
          .join(',')})`,
      )
      .orderBy('RANDOM()')
      .getOne();
  }
}
