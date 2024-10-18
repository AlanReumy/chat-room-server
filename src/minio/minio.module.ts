import { Global, Module } from '@nestjs/common';
import { MinioController } from './minio.controller';
import * as Minio from 'minio'
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  providers: [{
    provide: 'MINIO_CLIENT',
    async useFactory(configService: ConfigService) {
      const client = new Minio.Client({
        endPoint: 'localhost',
        port: 9000,
        useSSL: false,
        accessKey: configService.get('MINIO_ACCESS_KEY'),
        secretKey: configService.get('MINIO_SECRET_KEY')
      })
      return client;
    },
    inject: [ConfigService]
  }],
  exports: ['MINIO_CLIENT'],
  controllers: [MinioController]
})
export class MinioModule { }
