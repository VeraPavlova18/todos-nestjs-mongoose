import * as mongoose from 'mongoose';
import { TaskStatus } from 'src/tasks/task-status.enum';

export const TaskSchema = new mongoose.Schema({
  title: String,
  description: String,
  createdAt: Date,
  status: TaskStatus,
});
