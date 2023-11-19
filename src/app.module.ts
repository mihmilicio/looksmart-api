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
import { AuthModule } from './auth/auth.module';
import { WeatherModule } from './weather/weather.module';
import { LocationModule } from './location/location.module';
import { UserDetailsModule } from './user-details/user-details.module';
import { UserDetails } from './user-details/entities/user-details.entity';
import { LookHistory } from './look/entities/look-history';
import { ArticleModule } from './articles/article.module';

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
      entities: [ClothingItem, UserDetails, LookHistory],
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
    AuthModule,
    WeatherModule,
    LocationModule,
    UserDetailsModule,
    ArticleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
