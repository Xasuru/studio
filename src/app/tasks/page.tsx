"use client";

import React from 'react';
import Link from 'next/link';
import { useTasks } from '@/hooks/use-tasks';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Book, TestTube, Globe, MoreVertical } from 'lucide-react';

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

export default function TasksPage() {
  const { tasks, isLoading } = useTasks();

  const getIcon = (subject: string) => {
    return subjectIcons[subject] || subjectIcons.default;
  };

  return (
    <div className="flex flex-col gap-8 h-full">
      <header className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/">
            <ArrowLeft />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">All Lessons</h1>
          <p className="text-muted-foreground">Senior High School - 12th Grade</p>
        </div>
      </header>
      <div className="flex-grow">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full rounded-lg" />
            <Skeleton className="h-20 w-full rounded-lg" />
            <Skeleton className="h-20 w-full rounded-lg" />
            <Skeleton className="h-20 w-full rounded-lg" />
          </div>
        ) : tasks.length > 0 ? (
          <div className="space-y-4">
            {tasks.map(task => {
              const Icon = getIcon(task.subject);
              return (
                <Card key={task.id} className="hover:bg-accent transition-colors">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-grow">
                      <p className="font-semibold">{task.subject}</p>
                      <p className="text-sm text-muted-foreground">{task.taskName}</p>
                    </div>
                    <div className="w-12 h-12 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full border-2 border-primary flex items-center justify-center text-sm font-bold text-primary">
                          {task.isCompleted ? '✓' : '...'}
                        </div>
                    </div>
                     <Button variant="ghost" size="icon">
                        <MoreVertical className="w-5 h-5" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="flex items-center justify-center border-dashed h-full min-h-64">
            <div className="text-center text-muted-foreground">
              <p className="text-lg font-medium">No tasks logged yet.</p>
              <p>Add a task to see it here.</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
