import { Injectable } from '@nestjs/common';
import { UpdateClothingItemDto } from './dto/update-clothing-item.dto';
import { ClothingItem } from './entities/clothing-item.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { v4 as uuid } from 'uuid';

@Injectable()
export class ClothingItemsService {
  constructor(
    @InjectRepository(ClothingItem)
    private clothingItemsRepository: Repository<ClothingItem>,
    private readonly fileUploadService: FileUploadService,
  ) {}

  async create(image: Express.Multer.File): Promise<ClothingItem> {
    const id = uuid();
    const ext = image.originalname.split('.').pop();
    const filename = `clothing-items/${id}.${ext}`;

    await this.fileUploadService.uploadFile(image.buffer, filename);

    return this.clothingItemsRepository.save({
      id,
      image: process.env.STORAGE_URL + filename,
    });
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
