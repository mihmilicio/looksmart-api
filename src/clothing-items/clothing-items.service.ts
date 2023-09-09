import { Injectable } from '@nestjs/common';
import { UpdateClothingItemDto } from './dto/update-clothing-item.dto';
import { ClothingItem } from './entities/clothing-item.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ClothingItemsService {
  constructor(
    @InjectRepository(ClothingItem)
    private clothingItemsRepository: Repository<ClothingItem>,
  ) {}

  create(image: Express.Multer.File): Promise<ClothingItem> {
    // TODO upload
    return this.clothingItemsRepository.save({
      image: image.buffer.toString(),
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
  ): Promise<void> {
    const clothingItem = new ClothingItem();
    clothingItem.season = updateClothingItemDto.season;
    clothingItem.type = updateClothingItemDto.type;
    clothingItem.usage = updateClothingItemDto.usage;
    await this.clothingItemsRepository.update({ id }, clothingItem);
  }

  async remove(id: string): Promise<void> {
    await this.clothingItemsRepository.delete(id);
  }
}
