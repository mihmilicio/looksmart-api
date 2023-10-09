import { Module } from '@nestjs/common';
import { ClothingItemsService } from './clothing-items.service';
import { ClothingItemsController } from './clothing-items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClothingItem } from './entities/clothing-item.entity';
import { FileUploadModule } from 'src/file-upload/file-upload.module';
import { AiModule } from 'src/ai/ai.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClothingItem]),
    FileUploadModule,
    AiModule,
  ],
  controllers: [ClothingItemsController],
  providers: [ClothingItemsService],
})
export class ClothingItemsModule {}
