import { Document } from 'mongoose';
import { TaskStatus } from '../task-status.enum';
import * as mongoose from 'mongoose';

export interface Task extends Document {
  title: string;
  description: string;
  createdAt: Date;
  status: TaskStatus;
  owner: mongoose.Schema.Types.ObjectId;
}
