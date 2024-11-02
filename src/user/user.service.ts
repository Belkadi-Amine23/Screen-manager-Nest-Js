import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { LoginDto } from './dto/login.dto';
import { compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService, private readonly jwtService: JwtService) {}

    async login({email, password}: LoginDto) {
        const foundUser = await this.prismaService.user.findUnique({
            where: {email},
        });
        if (!foundUser) throw new NotFoundException('User and password combination is invalid');
        if (!compareSync(password, foundUser.password)) throw new NotFoundException('User and password combination is invalid');
        return {token: this.jwtService.sign({
            sub: foundUser.id,
            email: foundUser.email,
            name: foundUser.name,
            role: foundUser.role,
        })}
    }

    async getUsers() {
        return this.prismaService.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
            }
        });
    }
}
