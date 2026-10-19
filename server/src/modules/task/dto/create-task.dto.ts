import { IsEnum, IsOptional, IsString } from 'class-validator'
import { TaskStatus } from '../enums/task-status.enum'

export class CreateTaskDto {
    @IsString()
    title: string

    @IsString()
    @IsOptional()
    description?: string

    @IsString()
    @IsOptional()
    assignedUserId?: string

    @IsOptional()
    @IsEnum(TaskStatus)
    status?: TaskStatus

    @IsOptional()
    @IsString()
    projectId?: string
}