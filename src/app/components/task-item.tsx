"use client";

import React from 'react';
import { useTasks } from '@/hooks/use-tasks';
import type { Task } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Book, TestTube, Globe, MoreVertical } from 'lucide-react';
import { Button } from '../ui/button';


// Mapping subjects to icons
const subjectIcons: { [key: string]: React.ElementType } = {
  "Filipino": Book,
  "English": Book,
  "Math": TestTube,
  "Science": TestTube,
  "TLE": Globe,
  "MAPEH": Globe,
  "A.P.": Globe,
  "Values Ed.": Globe,
  "default": Book
};


interface TaskItemProps {
  task: Task;
}

export default function TaskItem({ task }: TaskItemProps) {
  const { toggleTask } = useTasks();

  const handleToggle = (e: React.MouseEvent) => {
    // Stop propagation to prevent card click from firing if we click the button
    e.stopPropagation();
    toggleTask(task.id);
  };

  const Icon = subjectIcons[task.subject] || subjectIcons.default;
  
  return (
    <Card
      className={cn(
        'transition-colors hover:bg-accent',
        task.isCompleted && 'bg-card/70 border-card/70 opacity-60'
      )}
    >
      <CardContent className="p-4 flex items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-full">
            <Icon className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-grow grid gap-0.5">
          <p
            className={cn(
              'font-semibold',
              task.isCompleted && 'line-through'
            )}
          >
            {task.subject}
          </p>
          <p
             className={cn(
              'text-sm text-muted-foreground',
              task.isCompleted && 'line-through'
            )}
          >{task.taskName}</p>
        </div>
        <div 
          onClick={handleToggle}
          role="button"
          aria-pressed={task.isCompleted}
          className="w-12 h-12 flex items-center justify-center cursor-pointer"
        >
          <div className={cn(
            "w-10 h-10 rounded-full border-2 border-primary flex items-center justify-center text-sm font-bold text-primary transition-colors",
            task.isCompleted && "bg-primary text-primary-foreground"
          )}>
            {task.isCompleted ? '✓' : '...'}
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <MoreVertical className="w-5 h-5" />
        </Button>
      </CardContent>
    </Card>
  );
}
