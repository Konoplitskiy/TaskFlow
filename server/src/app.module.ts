import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { TaskModule } from './modules/task/task.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal:true
  }),
  TypeOrmModule.forRootAsync({
   inject:[ConfigService],
   useFactory:typeOrmConfig
  }),
  UserModule,
  AuthModule,
  TaskModule
],
  controllers: [],
  providers: [],
})
export class AppModule {}
