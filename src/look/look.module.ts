import { Module } from '@nestjs/common';
import { LookService } from './look.service';
import { LookController } from './look.controller';
import { ClothingItemsModule } from 'src/clothing-items/clothing-items.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LookHistory } from './entities/look-history';
import { AiModule } from 'src/ai/ai.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LookHistory]),
    ClothingItemsModule,
    AiModule,
  ],
  providers: [LookService],
  controllers: [LookController],
})
export class LookModule {}
