import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  create() {

  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {

  }
}
