
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/common/enums/role.enum';
import { Roles, ROLES_KEY } from 'src/common/decorators/role.decorator';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {

  constructor(private readonly jwtService: JwtService, private reflector: Reflector) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const token = this.extractTokenFromCookie(context.switchToHttp().getRequest());
    if (!token) {
      return false;
    }

    if (!token) { throw new UnauthorizedException('No token provided!'); }
    try {
      const payload = await this.jwtService.verifyAsync(token, { secret: process.env.JWT_SECRET });
  console.log('RolesGuard payload:', payload); // Add this for debugging
      console.log('Required roles:', requiredRoles); // Add this for debugging
      return requiredRoles.includes(payload.role);

    } catch(error) {
            console.error('RolesGuard error:', error); // Add this for debugging

      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractTokenFromCookie(request: Request): string | undefined {
    const [type, token] = request.cookies?.Authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
  
}
