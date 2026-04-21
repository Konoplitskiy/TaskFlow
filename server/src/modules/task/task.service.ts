import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/task.dto';
import { User } from '../user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(Task)
        private readonly taskRepository:Repository<Task>
    ) {}

    async create(dto:CreateTaskDto, user:User) {
        const task = this.taskRepository.create({...dto, user})
        const saveTask = await this.taskRepository.save(task)
        return saveTask
    }


    async findAllByUser(userId:string) {
        const tasks = await this.taskRepository.find({where:{
            user:{
                id:userId
            }
        }})

        return tasks
    }
}
