
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/common/enums/role.enum';
import { ROLE_KEY } from 'src/common/decorators/role.decorator';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {

  constructor(private readonly jwtService: JwtService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRole = this.reflector.get<Role>(ROLE_KEY, context.getHandler());
    if (!requiredRole) {
      return true;
    }

    const token = this.extractTokenFromCookie(context.switchToHttp().getRequest()); 
    if (!token) {
      return false;
    }

    if (!token) { throw new UnauthorizedException('No token provided!'); }
      try {
          const payload = await this.jwtService.decode(token);

          console.log(payload);
          return payload.role === requiredRole;

      } catch {
          throw new UnauthorizedException('Invalid or expired token');
      }
  }

  private extractTokenFromCookie(request: Request) : string | undefined {
      const [type, token] = request.cookies?.Authorization?.split(' ') ?? [];
      return type === 'Bearer' ? token : undefined;
  }
}
