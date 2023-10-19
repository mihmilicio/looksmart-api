import { Module } from '@nestjs/common';
import { LookService } from './look.service';
import { LookController } from './look.controller';
import { ClothingItemsModule } from 'src/clothing-items/clothing-items.module';

@Module({
  providers: [LookService],
  controllers: [LookController],
  imports: [ClothingItemsModule],
})
export class LookModule {}
