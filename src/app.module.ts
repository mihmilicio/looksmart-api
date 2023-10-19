import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClothingItemsModule } from './clothing-items/clothing-items.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { ClothingItem } from './clothing-items/entities/clothing-item.entity';
import { FileUploadModule } from './file-upload/file-upload.module';
import { AiModule } from './ai/ai.module';
import { LookModule } from './look/look.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: 'looksmart-db',
      entities: [ClothingItem],
      synchronize: true,
      ssl: true,
      logging: true,
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
    }),
    ClothingItemsModule,
    FileUploadModule,
    AiModule,
    LookModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
