"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import type { Task } from '@/lib/types';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import {
  collection,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { addDocumentNonBlocking, deleteDocumentNonBlocking, setDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { signInAnonymously } from 'firebase/auth';
import { useAuth } from '@/firebase/provider';


interface TaskContextType {
  tasks: Task[];
  addTask: (subject: string, taskName: string) => void;
  toggleTask: (id: string) => void;
  isLoading: boolean;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);


export const TaskManagerProvider = ({ children }: { children: ReactNode }) => {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();

  useEffect(() => {
    if (!isUserLoading && !user) {
      signInAnonymously(auth);
    }
  }, [isUserLoading, user, auth]);
  
  const tasksQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'users', user.uid, 'tasks');
  }, [firestore, user]);

  const { data: tasks, isLoading } = useCollection<Omit<Task, 'id'>>(tasksQuery);

  const logsCollection = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'logs');
  }, [firestore]);

  const addTask = (subject: string, taskName: string) => {
    if (!tasksQuery || !logsCollection) return;

    const newTask = {
      subject,
      taskName,
      dueDate: 'Today', // This will be dynamic later
      isCompleted: false,
      createdAt: serverTimestamp(),
    };
    addDocumentNonBlocking(tasksQuery, newTask);

    const newLog = {
      timestamp: serverTimestamp(),
      subject: subject,
      action: `TASK ADDED: ${taskName}`,
    };
    addDocumentNonBlocking(logsCollection, newLog);
  };

  const toggleTask = (id: string) => {
    if (!tasksQuery || !logsCollection) return;
    const task = tasks?.find(t => t.id === id);
    if (!task) return;

    const taskRef = doc(tasksQuery, id);
    updateDocumentNonBlocking(taskRef, { isCompleted: !task.isCompleted });

    const newLog = {
      timestamp: serverTimestamp(),
      subject: task.subject,
      action: task.isCompleted ? `PENDING: ${task.taskName}`: `CHAIN SECURED: ${task.taskName}`,
    };
    addDocumentNonBlocking(logsCollection, newLog);
  };

  return (
    <TaskContext.Provider value={{ tasks: tasks || [], addTask, toggleTask, isLoading }}>
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
