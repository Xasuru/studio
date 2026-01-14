"use client";

import React from 'react';
import { useTasks } from '@/hooks/use-tasks';
import type { Task } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

interface TaskItemProps {
  task: Task;
}

export default function TaskItem({ task }: TaskItemProps) {
  const { toggleTask } = useTasks();

  const handleToggle = () => {
    toggleTask(task.id);
  };
  
  return (
    <Card
      onClick={handleToggle}
      className={cn(
        'cursor-pointer transition-colors hover:bg-accent',
        task.isCompleted && 'bg-card/70 border-card/70'
      )}
      role="button"
      aria-pressed={task.isCompleted}
    >
      <CardContent className="p-4 flex items-center gap-4">
        <Checkbox
          id={`task-${task.id}`}
          checked={task.isCompleted}
          aria-label={`Mark task '${task.taskName}' as ${task.isCompleted ? 'incomplete' : 'complete'}`}
          className="size-5"
          tabIndex={-1}
        />
        <div className="flex-grow grid gap-1">
          <p
            className={cn(
              'font-medium',
              task.isCompleted && 'line-through text-muted-foreground'
            )}
          >
            {task.taskName}
          </p>
          <p
             className={cn(
              'text-sm text-muted-foreground',
              task.isCompleted && 'line-through'
            )}
          >{task.subject}</p>
        </div>
        <span
          className={cn(
            'text-sm font-medium text-muted-foreground whitespace-nowrap',
            task.isCompleted && 'line-through'
          )}
        >
          Due {task.dueDate}
        </span>
      </CardContent>
    </Card>
  );
}
