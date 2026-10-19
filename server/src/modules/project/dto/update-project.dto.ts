import { IsArray, IsOptional, IsString, IsUUID } from 'class-validator'

export class UpdateProjectDto {
    @IsOptional()
    @IsString()
    title?: string

    @IsOptional()
    @IsString()
    description?: string

    @IsOptional()
    @IsArray()
    @IsUUID('4', { each: true })
    managerIds?: string[]

    @IsOptional()
    @IsArray()
    @IsUUID('4', { each: true })
    userIds?: string[]
}
