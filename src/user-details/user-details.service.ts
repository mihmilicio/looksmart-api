import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDetails } from './entities/user-details.entity';
import { Repository } from 'typeorm';
import { FileUploadService } from 'src/file-upload/file-upload.service';

@Injectable()
export class UserDetailsService {
  constructor(
    @InjectRepository(UserDetails)
    private userDetailsRepository: Repository<UserDetails>,
    private readonly fileUploadService: FileUploadService,
  ) {}

  async updateAvatar(
    image: Express.Multer.File,
    userId: string,
  ): Promise<string> {
    const ext = image.originalname.split('.').pop();
    const filename = `${userId}.${ext}`;

    await this.fileUploadService.uploadFile(
      image.buffer,
      `${process.env.AVATAR_DIR}/${filename}`,
    );

    const details = await this.findOrCreate(userId);
    details.image = `${process.env.STORAGE_URL}${process.env.AVATAR_DIR}/${filename}`;
    await this.userDetailsRepository.save(details);
    return details.image;
  }

  async updateLocation(location: string, userId: string): Promise<string> {
    const details = await this.findOrCreate(userId);
    details.location = location;
    await this.userDetailsRepository.save(details);
    return location;
  }

  findOne(userId: string): Promise<UserDetails | null> {
    return this.userDetailsRepository.findOneBy({ userId });
  }

  async findOrCreate(userId: string) {
    const details = await this.findOne(userId);
    if (details !== null) {
      return details;
    } else {
      return this.userDetailsRepository.create({ userId });
    }
  }
}
