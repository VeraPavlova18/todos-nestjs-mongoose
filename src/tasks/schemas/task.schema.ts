import * as mongoose from 'mongoose';
import { TaskStatus } from 'src/tasks/task-status.enum';

export const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true,
  },
  description: {
    type: String,
    trim: true,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  status: {
    type: TaskStatus,
    required: true,
  },
});
