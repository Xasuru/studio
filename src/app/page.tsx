"use client";

import React from 'react';
import { useTasks } from '@/hooks/use-tasks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TaskItem from '@/app/components/task-item';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const { tasks, isLoading } = useTasks();
  const incompleteTasks = tasks.filter(task => !task.isCompleted);
  const recentTasks = tasks.slice(0, 3);

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-3xl font-bold">Hi, Student</h1>
        <p className="text-muted-foreground">
          {isLoading ? (
            <Skeleton className="h-5 w-48 mt-1" />
          ) : (
            `You have ${incompleteTasks.length} pending task${incompleteTasks.length !== 1 ? 's' : ''}.`
          )}
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-primary border-primary/50 text-primary-foreground">
          <CardHeader>
            <CardTitle>Daily Debrief</CardTitle>
          </CardHeader>
          <CardContent>
            <p>A quick summary of your day's missions. Stay on track!</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Calendar Sync</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Preview your upcoming deadlines and events.</p>
          </CardContent>
        </Card>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">Recent Logs</h2>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : recentTasks.length > 0 ? (
          <div className="space-y-4">
            {recentTasks.map(task => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <Card className="flex items-center justify-center p-10">
            <p className="text-muted-foreground">No recent tasks.</p>
          </Card>
        )}
      </section>
    </div>
  );
}
