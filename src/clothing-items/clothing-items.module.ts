import { Module } from '@nestjs/common';
import { ClothingItemsService } from './clothing-items.service';
import { ClothingItemsController } from './clothing-items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClothingItem } from './entities/clothing-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClothingItem])],
  controllers: [ClothingItemsController],
  providers: [ClothingItemsService],
})
export class ClothingItemsModule {}
