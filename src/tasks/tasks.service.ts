import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from './interfaces/task.interface';
import { CreateTaskDto } from './dto/create-task.dto';
import { User } from 'src/auth/interfaces/user.interface';
import { TaskStatus } from './task-status.enum';
import * as moment from 'moment';
import { UserObject } from 'src/auth/schemas/user.schema';

@Injectable()
export class TasksService {
  private logger = new Logger('TaskService');

  constructor(
    @InjectModel('Task')
    private readonly taskModel: Model<Task>,
    @InjectModel('User')
    private readonly userModel: Model<UserObject>,
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

}
