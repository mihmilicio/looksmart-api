import { PutObjectCommandOutput } from './../../node_modules/@aws-sdk/client-s3/dist-types/ts3.4/commands/PutObjectCommand.d';
import { Injectable } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

@Injectable()
export class FileUploadService {
  s3Client = new S3Client({
    endpoint: process.env.STORAGE_ENDPOINT,
    forcePathStyle: false,
    region: 'us-east-1',
    credentials: {
      accessKeyId: process.env.STORAGE_ACCESS_KEY_ID,
      secretAccessKey: process.env.STORAGE_ACCESS_KEY_SECRET,
    },
  });

  async uploadFile(
    dataBuffer: Buffer,
    filename: string,
  ): Promise<PutObjectCommandOutput> {
    const params = {
      Bucket: 'looksmart',
      Key: filename,
      Body: dataBuffer,
      ACL: 'public-read',
    };

    try {
      const data = await this.s3Client.send(new PutObjectCommand(params));
      console.log(
        'Successfully uploaded object: ' + params.Bucket + '/' + params.Key,
      );
      return data;
    } catch (err) {
      console.log('Error', err);
      throw new FileUploadFailedException(err.message);
    }
  }
}
