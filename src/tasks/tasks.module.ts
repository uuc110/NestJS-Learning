import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { TaskRepository } from './task.repository';
import { DataSource } from 'typeorm';
import { TasksService } from './tasks.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), AuthModule],
  controllers: [TasksController],
  providers: [
    {
      provide: 'TaskRepository',
      useFactory: (dataSource: DataSource) => {
        return new TaskRepository(dataSource);
      },
      inject: [DataSource],
    },
    TasksService,
  ],
})
export class TasksModule {}
