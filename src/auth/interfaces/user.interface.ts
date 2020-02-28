import { Document } from 'mongoose';
import { Task } from 'src/tasks/interfaces/task.interface';

export interface User extends Document {
  name: string;
  email: string;
  password: string;
  salt: string;
  tasks: Task[];
}
