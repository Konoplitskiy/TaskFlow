import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserData } from './interfaces/user.interface';
import { Role } from './enums/role.enum';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userService: Repository<User>
    ) { }

    async findByEmail(email: string) {
        const user = await this.userService.findOne({ where: { email } })
        return user
    }

    async create(data: CreateUserData) {
        const user = await this.userService.create(data)
        const saveUser = await this.userService.save(user)
        return saveUser
    }

    async findAll() {
        return this.userService.find({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
            },
        })
    }

    async updateRole(id: string, role: Role) {
        const user = await this.userService.findOne({ where: { id } })
        if (!user) {
            throw new NotFoundException('User not Found')
        }

        user.role = role
        return this.userService.save(user)
    }


    async deleteUser(id: string) {
        const user = await this.userService.findOne({ where: { id } })

        if (!user) {
            throw new NotFoundException('User not found')
        }

        return this.userService.remove(user)
    }
}
