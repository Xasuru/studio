"use client";

import React from 'react';
import Link from 'next/link';
import { useTasks } from '@/hooks/use-tasks';
import { subjects as allSubjects, type Task } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ArrowLeft } from 'lucide-react';
import TaskItem from '../components/task-item';
import { Skeleton } from '@/components/ui/skeleton';

export default function TasksPage() {
  const { tasks, isLoading } = useTasks();

  const getTasksBySubject = (subjectName: string): Task[] => {
    return tasks.filter(task => task.subject === subjectName);
  };

  const sortedSubjects = React.useMemo(() => {
    return [...allSubjects].sort((a, b) => {
      const tasksA = getTasksBySubject(a.name);
      const tasksB = getTasksBySubject(b.name);
      const hasIncompleteA = tasksA.some(t => !t.isCompleted);
      const hasIncompleteB = tasksB.some(t => !t.isCompleted);

      if (hasIncompleteA && !hasIncompleteB) return -1;
      if (!hasIncompleteA && hasIncompleteB) return 1;
      
      return a.name.localeCompare(b.name);
    });
  }, [tasks]);

  const defaultActiveItems = sortedSubjects
    .filter(subject => getTasksBySubject(subject.name).some(t => !t.isCompleted))
    .map(subject => subject.name);

  return (
    <div className="flex flex-col gap-6 h-full">
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
      
      {isLoading ? (
         <div className="w-full space-y-4">
          {[...Array(4)].map((_, i) => (
             <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      ) : (
        <Accordion 
          type="multiple" 
          className="w-full space-y-4"
          defaultValue={defaultActiveItems}
        >
          {sortedSubjects.map(subject => {
            const subjectTasks = getTasksBySubject(subject.name);
            const incompleteCount = subjectTasks.filter(t => !t.isCompleted).length;

            return (
              <AccordionItem value={subject.name} key={subject.name} className="border-b-0 rounded-lg bg-card overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/10">
                <AccordionTrigger className="px-4 py-3 hover:no-underline group">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full group-hover:from-primary/30 transition-colors">
                      <subject.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-base">{subject.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {incompleteCount > 0 ? `${incompleteCount} task${incompleteCount > 1 ? 's' : ''} due` : 'All caught up!'}
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-3">
                  {subjectTasks.length > 0 ? (
                    <div className="flex flex-col gap-2 pt-2 border-t">
                      {subjectTasks.sort((a,b) => (a.isCompleted ? 1 : -1) - (b.isCompleted ? 1 : -1) || a.taskName.localeCompare(b.taskName)).map(task => (
                        <TaskItem key={task.id} task={task} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-sm text-muted-foreground py-4">
                      No tasks for {subject.name} yet.
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}
    </div>
  );
}
