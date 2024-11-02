import { CanActivate, ExecutionContext, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { IS_PUBLIC_KEY } from "./public.decorator";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class IsLoggedInGuard implements CanActivate {
    constructor(readonly jwtService: JwtService, readonly reflector: Reflector) { }

    async canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException('No token provided');
        }
        try {
            this.jwtService.verify(token);
        } catch (e) {

            if (e.name === 'TokenExpiredError') {
                throw new UnauthorizedException('Token expired');
            }
            if (e.name === 'JsonWebTokenError') {
                throw new UnauthorizedException('Invalid token');
            }
            if (e.name === 'NotBeforeError') {
                throw new UnauthorizedException('Token not active');
            }
            Logger.error(`Invalid token error: ${e.name}`, e);
            throw new InternalServerErrorException();
        }
        return true;
    }

    extractTokenFromHeader(request) {
        if (!request.headers.authorization) {
            return null;
        }
        const [bearer, token] = request.headers.authorization.split(' ');
        if (bearer !== 'Bearer' || !token) {
            return null;
        }
        return token;
    }
}

export enum Role {
    ADMIN = 'admin',
    USER = 'user',
}

export function IsRoleGuard(role: Role) {

@Injectable()
class isRoleGuardClass extends IsLoggedInGuard {
    constructor(readonly jwtService: JwtService, readonly reflector: Reflector, readonly prismaService: PrismaService) {
        super(jwtService, reflector);
    }
    async canActivate(context: ExecutionContext) {
        if (!(await super.canActivate(context))) {
            return false;
        }
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        const payload = this.jwtService.decode(token);
        const user = await this.prismaService.user.findUnique({
            where: {id: payload.sub},
        });
        return user.role === role;
    }
}
return isRoleGuardClass;
}