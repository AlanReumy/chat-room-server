import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { RedisModule } from './redis/redis.module';
import { EmailModule } from './email/email.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from './prisma/prisma.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule, UserModule, RedisModule, EmailModule, JwtModule.registerAsync({
      global: true,
      useFactory() {
        return {
          secret: "",
          signOptions: {
            expiresIn: "30m"
          }
        }
      }
    })],
  controllers: [AppController],
  providers: [AppService, PrismaService, {
    provide: APP_GUARD,
    useClass: AuthGuard
  }],
})
export class AppModule { }
