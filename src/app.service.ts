import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async getSecureUrl() {
    const s3 = new S3({
      region: 'eu-central-1',
      accessKeyId: 'AKIA5UOS63XQYWHPLIVX',
      secretAccessKey: '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',
      signatureVersion: 'v4',
    });

    const imageName = uuidv4();
    const params = {
      Bucket: '02-geotagger',
      Key: imageName,
      Expires: 60,
    };

    const uploadUrl = await s3.getSignedUrlPromise('putObject', params);
    return uploadUrl;
  }
}
