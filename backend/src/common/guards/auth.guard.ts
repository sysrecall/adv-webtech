import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromCookie(request);
        console.log(token);

        if (!token) { throw new UnauthorizedException('No token provided!'); }

        try {
            const payload = await this.jwtService.verifyAsync(
                token, { secret: process.env.JWT_SECRET }
            );
            
            request['user'] = payload;
        } catch {
            throw new UnauthorizedException('Invalid or expired token');
        }
        
        return true;
    }

    private extractTokenFromCookie(request: Request) : string | undefined {
      const [type, token] = request.cookies?.Authorization?.split(' ') ?? [];
      return type === 'Bearer' ? token : undefined;
  }
}