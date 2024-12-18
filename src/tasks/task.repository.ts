import { DataSource, Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './Dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { searchTaskFilter } from './Dto/search-task-filter.dto';
import { User } from '../auth/user.entity';
import { Logger } from '@nestjs/common';

export class TaskRepository extends Repository<Task> {
  private logger = new Logger('TaskRepository');

  constructor(dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  async getTasks(filterDto: searchTaskFilter, user: User): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');
    query.where({ user });
    if (status) {
      query.andWhere('task.status = :status', { status }); // -> :status is variable while
    }

    if (search) {
      query.andWhere(
        '(task.title LIKE :search OR task.description LIKE :search)',
        { search: `%${search}%` },
      );
    }

    this.logger.debug(`Executing query: ${query.getSql()}`);
    const tasks = await query.getMany();
    this.logger.debug(`Found tasks: ${JSON.stringify(tasks)}`);
    return tasks;
  }

  // We Created this so now we only need the service whose sole purpose is to create task. while main error handlign
  // can be done in service.ts
  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
      //we assign user here so this will automatically allow us to connect that user with thhe task since we cerate
      // a manytoone user: User in entity
    });
    await this.save(task);
    return task;
  }
}
