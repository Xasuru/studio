"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { format, subDays, addDays } from 'date-fns';
import type { Task } from '@/lib/types';

interface TaskContextType {
  tasks: Task[];
  addTask: (subject: string, taskName: string) => void;
  toggleTask: (id: string) => void;
  isLoading: boolean;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const defaultTasks: Task[] = [
  {
    id: '1',
    subject: 'Math',
    taskName: 'LAS #10',
    dueDate: 'Today',
    isCompleted: false,
  },
  {
    id: '2',
    subject: 'Science',
    taskName: 'LAS #4',
    dueDate: 'Yesterday',
    isCompleted: true,
  },
  {
    id: '3',
    subject: 'English',
    taskName: 'Essay Draft',
    dueDate: 'Tomorrow',
    isCompleted: false,
  },
];


export const TaskManagerProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem('missionControlTasks');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      } else {
        setTasks(defaultTasks);
      }
    } catch (error) {
      console.error("Failed to load tasks from localStorage", error);
      setTasks(defaultTasks);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem('missionControlTasks', JSON.stringify(tasks));
      } catch (error) {
        console.error("Failed to save tasks to localStorage", error);
      }
    }
  }, [tasks, isLoading]);

  const addTask = (subject: string, taskName: string) => {
    const newTask: Task = {
      id: new Date().toISOString(),
      subject,
      taskName,
      dueDate: 'Today',
      isCompleted: false,
    };
    setTasks(prevTasks => [newTask, ...prevTasks]);
  };

  const toggleTask = (id: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
      )
    );
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, toggleTask, isLoading }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskManagerProvider');
  }
  return context;
};
