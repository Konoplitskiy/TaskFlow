import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './project.entity';
import { In, Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectService {
    constructor(
        @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { }

    private sanitize(project: Project) {
        return {
            ...project,
            managers: (project.managers || []).map(({ password, ...manager }) => manager),
            users: (project.users || []).map(({ password, ...user }) => user),
        }
    }

    private async loadUsersByIds(ids?: string[]) {
        if (!ids?.length) return []
        return this.userRepository.findBy({ id: In(ids) })
    }

    async create(dto: CreateProjectDto) {
        const managers = await this.loadUsersByIds(dto.managerIds)
        const users = await this.loadUsersByIds(dto.userIds)

        const project = this.projectRepository.create({
            title: dto.title,
            description: dto.description,
            managers,
            users,
        })

        const savedProject = await this.projectRepository.save(project)
        return this.sanitize(savedProject)
    }

    async findAll() {
        const projects = await this.projectRepository.find({
            relations: ['managers', 'users', 'tasks'],
            order: { createdAt: 'DESC' },
        })

        return projects.map(project => this.sanitize(project))
    }

    async findOne(id: string) {
        const project = await this.projectRepository.findOne({
            where: { id },
            relations: ['managers', 'users', 'tasks'],
        })

        if (!project) {
            throw new NotFoundException('Project not found')
        }

        return this.sanitize(project)
    }

    async update(id: string, dto: UpdateProjectDto) {
        const project = await this.projectRepository.findOne({
            where: { id },
            relations: ['managers', 'users'],
        })

        if (!project) {
            throw new NotFoundException('Project not found')
        }

        if (dto.title !== undefined) project.title = dto.title
        if (dto.description !== undefined) project.description = dto.description

        if (dto.managerIds !== undefined) {
            project.managers = await this.loadUsersByIds(dto.managerIds)
        }

        if (dto.userIds !== undefined) {
            project.users = await this.loadUsersByIds(dto.userIds)
        }

        const saved = await this.projectRepository.save(project)
        return this.sanitize(saved)
    }

    async remove(id: string) {
        const project = await this.projectRepository.findOne({ where: { id } })

        if (!project) {
            throw new NotFoundException('Project not found')
        }

        await this.projectRepository.remove(project)
        return { message: 'Project deleted successfully' }
    }
}
