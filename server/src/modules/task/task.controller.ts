import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { User } from '../auth/decorators/user.decorator';
import { UpdateTaskDto } from './dto/update-task.dto';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/role.decorators';
import { Role } from '../user/enums/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) { }
  
@Post()
create(@Body() dto: CreateTaskDto, @User() user) {
  if (user.role === Role.MANAGER || user.role === Role.ADMIN) {
    return this.taskService.create(dto, dto.assignedUserId || user.userId)
  }

  return this.taskService.create(dto, user.userId)
}

  @Get()
  findAll(@User() user) {
    return this.taskService.findAllByUser(user.userId)
  }

  @Get('all')
  @Roles(Role.ADMIN, Role.MANAGER)
  findAllTasks() {
    return this.taskService.findAllTasks()
  }

  @Get(':id')
  findOneByUser(@Param('id') id: string, @User() user) {
    return this.taskService.findOneByUser(id, user.userId)
  }
  @Patch(':id')
  updateTask(@Param('id') id: string, @Body() dto: UpdateTaskDto, @User() user) {
    if (user.role === Role.ADMIN || user.role === Role.MANAGER) {
      return this.taskService.updateById(id, dto)
    }

    return this.taskService.updateByUser(id, user.userId, dto)
  }

  @Delete(':id')
  @Roles(Role.MANAGER, Role.ADMIN)
  deleteTask(@Param('id') id: string) {
    return this.taskService.deleteTask(id)
  }
}

