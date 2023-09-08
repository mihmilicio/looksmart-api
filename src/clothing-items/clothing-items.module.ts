import { Module } from '@nestjs/common';
import { ClothingItemsService } from './clothing-items.service';
import { ClothingItemsController } from './clothing-items.controller';

@Module({
  controllers: [ClothingItemsController],
  providers: [ClothingItemsService],
})
export class ClothingItemsModule {}
