import { IsNotEmpty, IsOptional, IsIn, IsNumberString } from 'class-validator';
import { TaskStatus } from '../task-status.enum';

export class GetTasksFilterDto {
  @IsOptional()
  @IsNotEmpty()
  @IsNumberString()
  take: string;

  @IsOptional()
  @IsNotEmpty()
  @IsNumberString()
  skip: string;

  @IsOptional()
  @IsIn([TaskStatus.IN_PROGRESS, TaskStatus.DONE])
  status: TaskStatus;

  @IsOptional()
  @IsNotEmpty()
  search: string;
}
