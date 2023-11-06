import { Module } from '@nestjs/common';
import { UserDetailsService } from './user-details.service';
import { UserDetailsController } from './user-details.controller';
import { UserDetails } from './entities/user-details.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileUploadModule } from 'src/file-upload/file-upload.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserDetails]), FileUploadModule],
  providers: [UserDetailsService],
  controllers: [UserDetailsController],
  exports: [UserDetailsService],
})
export class UserDetailsModule {}
