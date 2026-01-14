"use client";

import React from 'react';
import { useTasks } from '@/hooks/use-tasks';
import TaskItem from '@/app/components/task-item';
import AddTaskDialog from '@/app/components/add-task-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export default function TasksPage() {
  const { tasks, isLoading } = useTasks();

  return (
    <div className="flex flex-col gap-8 h-full">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Task Logs</h1>
        <AddTaskDialog />
      </header>
      <div className="flex-grow">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : tasks.length > 0 ? (
          <div className="space-y-4">
            {tasks.map(task => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        ) : (
           <Card className="flex items-center justify-center border-dashed h-full min-h-64">
            <div className="text-center text-muted-foreground">
              <p className="text-lg font-medium">No tasks logged yet.</p>
              <p>Click "LOG IT" to get started.</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
