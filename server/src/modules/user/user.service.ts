import {  Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserData } from './interfaces/user.interface';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userService:Repository<User>
    ) {}

   async findByEmail(email:string) {
            const user = await this.userService.findOne({where:{email}})
            return user
    }

    async create(data:CreateUserData) {
        const user = await this.userService.create(data)
        const saveUser = await this.userService.save(user)
        return saveUser
    }

}
