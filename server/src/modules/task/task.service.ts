import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(Task)
        private readonly taskRepository: Repository<Task>
    ) { }

    async create(dto: CreateTaskDto, userId: string) {
        const { assignedUserId, projectId, ...rest } = dto

        const task = this.taskRepository.create({
            ...rest,
            user: { id: userId },
            project: projectId ? { id: projectId } : undefined
        })

        return this.taskRepository.save(task)
    }


    async findAllByUser(userId: string) {
        const tasks = await this.taskRepository.find({
            where: {
                user: {
                    id: userId
                }
            },
            relations:['project']
        })

        return tasks
    }

    async findAllTasks() {
        return await this.taskRepository.find()
    }

    async findOneByUser(taskId: string, userId: string) {
        const task = await this.taskRepository.findOne({
            where: {
                id: taskId,
                user: {
                    id: userId,
                },
            },
            relations:['user', 'project']
        });

        if (!task) {
            throw new NotFoundException('Task not found')
        }
        return task
    }

    async updateByUser(taskId: string, userId: string, dto: UpdateTaskDto) {
        const task = await this.taskRepository.findOne({
            where: {
                id: taskId,
                user: {
                    id: userId
                }
            }
        })
        if (!task) {
            throw new NotFoundException('Task not found')
        }
        const updateTask = Object.assign(task, dto)
        const save = await this.taskRepository.save(updateTask)
        return save
    }

    async deleteTask(taskId: string) {
        const task = await this.taskRepository.findOne({
            where: {
                id: taskId,
            }
        })
        if (!task) {
            throw new NotFoundException('Task not found')
        }
        await this.taskRepository.remove(task)
        return { message: 'Task deleted' }
    }

    async updateById(taskId: string, dto: UpdateTaskDto) {
        const task = await this.taskRepository.findOne({
            where: {
                id: taskId,
            },
        })

        if (!task) {
            throw new NotFoundException('Task not found')
        }

        Object.assign(task, dto)

        return this.taskRepository.save(task)
    }
}
