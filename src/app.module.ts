import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClothingItemsModule } from './clothing-items/clothing-items.module';

@Module({
  imports: [ClothingItemsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
