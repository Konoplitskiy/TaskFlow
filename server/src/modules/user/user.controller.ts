import { Body, Controller, Delete, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Roles } from '../task/decorators/role.decorators';
import { Role } from './enums/role.enum';
import { RolesGuard } from '../task/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('user')
@UseGuards(JwtAuthGuard,RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) { }
  @Get()
  @Roles(Role.ADMIN, Role.MANAGER)
  findAll() {
    return this.userService.findAll()
  }

  @Patch(':id/role')
  @Roles(Role.ADMIN)
  updateRole(@Param('id') id:string, @Body('role') role:Role) {
      return this.userService.updateRole(id, role)
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  deleteUser(@Param('id') id:string) {
    return this.userService.deleteUser(id)
  }
}
