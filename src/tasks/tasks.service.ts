import { Injectable, Logger, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from './interfaces/task.interface';
import { CreateTaskDto } from './dto/create-task.dto';
import { User } from 'src/auth/interfaces/user.interface';
import { TaskStatus } from './task-status.enum';
import * as moment from 'moment';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  private logger = new Logger('TaskService');

  constructor(
    @InjectModel('Task')
    private readonly taskModel: Model<Task>,
  ) {}

  async createTask(
    createTaskDto: CreateTaskDto,
    user: User,
  ): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = new this.taskModel();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.IN_PROGRESS;
    task.createdAt = moment().toDate();

    user.tasks.push(task);

    try {
      await user.save();
    } catch (error) {
      throw new InternalServerErrorException();
    }
    return task;
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const task = await user.tasks.id(id);
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return task;
  }

  async getTasks(user: User): Promise<Task[]> {
    try {
      const tasks = await user.tasks;
      tasks.sort((n1, n2) => {
        if (n1.createdAt > n2.createdAt) {
          return -1;
        }
        if (n1.createdAt < n2.createdAt) {
          return 1;
        }
        return 0;
      });
      return tasks;
    } catch (error) {
      this.logger.error(
        `Failed to get tasks for user "${user.email}".}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async deleteTaskById(id: string, user: User): Promise<void> {
    const task = await this.getTaskById(id, user);
    try {
      await task.remove();
      await user.save();
      this.logger.verbose(`User "${user.email}" deleted task with ID "${id}".`);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async updateTask(
    id: string,
    updateTaskDto: UpdateTaskDto,
    user: User,
  ): Promise<Task> {
    const { title, description, status } = updateTaskDto;
    const task = await this.getTaskById(id, user);

    task.title = title ?? task.title;
    task.description = description ?? task.description;
    task.status = status ?? task.status;

    await user.save();
    return task;
  }

  async updateStatus(
    id: string,
    updateTaskDto: UpdateTaskDto,
    user: User,
  ): Promise<Task> {
    const { status } = updateTaskDto;
    const task = await this.getTaskById(id, user);
    task.status = status ?? task.status;

    await user.save();
    return task;
  }

}
