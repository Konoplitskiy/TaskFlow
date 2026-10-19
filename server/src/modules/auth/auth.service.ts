import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { Role } from '../user/enums/role.enum';


@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) { }

    async register(dto: RegisterDto) {
        const { email, password, name } = dto
        const existingUser = await this.userService.findByEmail(email)
        if (existingUser) {
            throw new ConflictException('User already exists')
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const userCreate = await this.userService.create({
            email: email,
            password: hashedPassword,
            name: name
        })

        const tokens = await this.generateTokens(userCreate.id, userCreate.role)
        return {
            tokens,
            user: {
                id: userCreate.id,
                email: userCreate.email,
                name: userCreate.name,
                role: userCreate.role
            }
        }
    }

    async login(dto: LoginDto) {
        const { email, password } = dto
        const user = await this.userService.findByEmail(email)
        if (!user) {
            throw new UnauthorizedException('Email or password is incorrect')
        }
        const passwordCorrect = await bcrypt.compare(password, user.password)
        if (!passwordCorrect) {
            throw new UnauthorizedException('Email or password is incorrect')
        }


        const tokens = await this.generateTokens(user.id, user.role)

        return {
            tokens,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        }
    }


    async generateTokens(userId: string, role: Role) {
        const payload = {
            sub: userId,
            role: role
        }

        const access_token = await this.jwtService.signAsync(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn: '1h',
        })
        const refresh_token = await this.jwtService.signAsync(payload, {
            secret: process.env.JWT_REFRESH_SECRET,
            expiresIn: '7d',
        })

        return {
            access_token,
            refresh_token
        }
    }

    async refreshTokens(refreshToken: string) {
        if (!refreshToken) {
            throw new UnauthorizedException('Token is empty')
        }

        try {
            const payload = await this.jwtService.verifyAsync(refreshToken, {
                secret: process.env.JWT_REFRESH_SECRET,
            })
            return this.generateTokens(payload.sub, payload.role)
        } catch {
            throw new UnauthorizedException('Invalid refresh token')
        }
    }

}
