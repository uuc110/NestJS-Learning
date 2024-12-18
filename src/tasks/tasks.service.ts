import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './Dto/create-task.dto';
import { TaskRepository } from './task.repository';
import { TaskStatus } from './task-status.enum';
import { searchTaskFilter } from './Dto/search-task-filter.dto';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @Inject('TaskRepository')
    private TaskRepository: TaskRepository,
  ) {}

  async getAllTask(): Promise<Task[]> {
    const task = await this.TaskRepository.find();
    return task;
  }

  getTasks(filterDto: searchTaskFilter, user: User): Promise<Task[]> {
    return this.TaskRepository.getTasks(filterDto, user);
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const found = await this.TaskRepository.findOne({ where: { id, user } });

    if (found.user !== user) {
      throw new NotFoundException();
    }

    if (!found) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return found;
  }

  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.TaskRepository.createTask(createTaskDto, user);
  }

  async deleteTask(id: string, user: User): Promise<void> {
    const toDelete = await this.TaskRepository.delete({ id, user });

    if (toDelete.affected === 0) {
      throw new NotFoundException(`To delete the ${id} is not foudn in DB`);
    }
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await this.TaskRepository.save(task);
    return task;
  }
}
