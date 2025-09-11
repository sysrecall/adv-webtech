import { forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { CustomerService } from 'src/modules/customer/customer.service';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { AdminService } from 'src/admin/admin.service';
import { ArtistService } from 'src/artist/artist.service';
//{}
@Injectable()
export class AuthService {
    // adminService: any;
    constructor(
        private readonly jwtService: JwtService, 
        private readonly customerService: CustomerService,
        private readonly adminService: AdminService,
        private readonly artistService: ArtistService,
    ) {}
    
    async signIn(username: string, pass: string, role: 'customer' | 'admin' | 'artist'): Promise<{ access_token: string }> {
        let user;
        switch (role) {
            case 'admin':
                user = await this.adminService.findOneByUsername(username);
                break;
             case 'artist':
                 user = await this.artistService.findOneByUsername(username);
                 break;
            default:
                user = await this.customerService.findOneByUsername(username);
                break;
        }

        if (!user) throw new UnauthorizedException();

        const { passwordHash } = user;
        const result = await compare(pass, passwordHash);

        if (!user.id || isNaN(user.id)) {
            throw new UnauthorizedException("Invalid user ID");
            }

        if (!result) throw new UnauthorizedException();
        // console.log("Auth user:", user);
        // console.log("User.id type:", typeof user.id, "value:", user.id);


        const payload = { id: user.id, username: user.username, role: role };
        const token = await this.jwtService.signAsync(payload, {
            secret: process.env.JWT_SECRET
        });

        return { access_token: token }
    }
}