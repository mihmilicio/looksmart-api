import { Module } from '@nestjs/common';
import { LookService } from './look.service';
import { LookController } from './look.controller';
import { ClothingItemsModule } from 'src/clothing-items/clothing-items.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LookHistory } from './entities/look-history';

@Module({
  imports: [TypeOrmModule.forFeature([LookHistory]), ClothingItemsModule],
  providers: [LookService],
  controllers: [LookController],
})
export class LookModule {}
