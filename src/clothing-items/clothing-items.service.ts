import { Injectable } from '@nestjs/common';
import { UpdateClothingItemDto } from './dto/update-clothing-item.dto';
import { ClothingItem } from './entities/clothing-item.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { v4 as uuid } from 'uuid';
import { AiService } from 'src/ai/ai.service';
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

    const saved = await this.clothingItemsRepository.save({
      id,
      image: `${process.env.STORAGE_URL}${
        skipAI ? process.env.IMAGES_DIR : process.env.IMAGES_NO_BG_DIR
      }/${filename}`,
    });

    return {
      id: saved.id,
      image: saved.image,
      type: skipAI ? 'top' : predicted.type,
      season: skipAI ? 'meia-estacao' : predicted.season,
      usage: skipAI ? 'universal' : predicted.usage,
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
}
