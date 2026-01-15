"use client";

import React from 'react';
import { useTasks } from '@/hooks/use-tasks';
import type { Task } from '@/lib/types';
import { cn } from '@/lib/utils';
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
    <div
      onClick={handleToggle}
      role="button"
      aria-pressed={task.isCompleted}
      className={cn(
        'flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-accent/50',
        task.isCompleted && 'opacity-60'
      )}
    >
      <Checkbox
        id={`task-${task.id}`}
        checked={task.isCompleted}
        onCheckedChange={handleToggle}
        className="size-5 rounded-full border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
      />
      <label
        htmlFor={`task-${task.id}`}
        className={cn(
          'flex-grow cursor-pointer text-sm font-medium',
          task.isCompleted && 'line-through text-muted-foreground'
        )}
      >
        {task.taskName}
      </label>
       <div className="text-xs text-muted-foreground">{task.dueDate}</div>
    </div>
  );
}
