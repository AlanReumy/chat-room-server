import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Request, Response } from 'express'

interface JwtUserData {
  userId: number;
  username: string;
}

declare module 'express' {
  interface Request {
    user: JwtUserData
  }
}

@Injectable()
export class AuthGuard implements CanActivate {

  @Inject()
  private reflector: Reflector;

  @Inject(JwtService)
  private jwtService: JwtService;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse()

    const requireLogin = this.reflector.getAllAndOverride('require-login', [
      context.getClass(),
      context.getHandler()
    ]);

    if (!requireLogin) {
      return true;
    }

    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException('用户未登录');
    }

    try {
      const token = authorization.split(' ')[1];
      const data = this.jwtService.verify<JwtUserData>(token);

      request.user = {
        userId: data.userId,
        username: data.username,
      }

      response.header('token', this.jwtService.sign({
        userId: data.userId,
        username: data.username,
      }))

      return true;
    } catch (e) {
      throw new UnauthorizedException('token 失效，请重新登录');
    }
  }
}
