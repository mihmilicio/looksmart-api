import { Injectable } from '@nestjs/common';
import { CreateClothingItemDto } from './dto/create-clothing-item.dto';
import { UpdateClothingItemDto } from './dto/update-clothing-item.dto';
import { ClothingItem } from './entities/clothing-item.entity';

@Injectable()
export class ClothingItemsService {
  create(createClothingItemDto: CreateClothingItemDto) {
    const clothingItem = new ClothingItem();
    clothingItem.image = createClothingItemDto.image;
    clothingItem.season = 'Verão';
    clothingItem.type = 'Camiseta';
    clothingItem.usage = 'Casual';
    clothingItem.id = '21b74106-c869-4db2-b438-d182bb3b986d';
    return clothingItem;
  }

  findAll() {
    return `This action returns all clothingItems`;
  }

  findOne(id: string) {
    return `This action returns a #${id} clothingItem`;
  }

  update(id: string, updateClothingItemDto: UpdateClothingItemDto) {
    const clothingItem = new ClothingItem();
    clothingItem.image = 'url/camiseta.jpg';
    clothingItem.season = updateClothingItemDto.season;
    clothingItem.type = updateClothingItemDto.type;
    clothingItem.usage = updateClothingItemDto.usage;
    clothingItem.id = id;
    return clothingItem;
  }

  remove(id: string) {
    return `This action removes a #${id} clothingItem`;
  }
}
