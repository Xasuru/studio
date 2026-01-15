"use client";

import React from 'react';
import Link from 'next/link';
import { useTasks } from '@/hooks/use-tasks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { subjects } from '@/lib/types';
import TaskItem from './components/task-item';
import TerminalFeed from './components/terminal-feed';
import { motion } from 'framer-motion';

export default function Home() {
  const { tasks } = useTasks();
  const upcomingTasks = tasks.filter(t => !t.isCompleted).slice(0, 3);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div 
      className="flex flex-col gap-8"
      initial="hidden"
      animate="visible"
      variants={cardVariants}
    >
      {/* Header */}
      <motion.header className="space-y-1" variants={itemVariants}>
        <h1 className="text-3xl font-bold">Hi, Student</h1>
        <p className="text-muted-foreground">You have {tasks.filter(t => !t.isCompleted).length} pending tasks.</p>
      </motion.header>

      {/* Terminal Feed */}
      <motion.section variants={itemVariants}>
        <TerminalFeed />
      </motion.section>

      {/* Upcoming Tasks Widget */}
      <motion.section variants={itemVariants}>
        <Card className="bg-gradient-to-br from-primary/20 to-card">
          <CardHeader>
            <CardTitle>Mission Queue</CardTitle>
            <CardDescription>Your next 3 upcoming tasks.</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingTasks.length > 0 ? (
              <div className="flex flex-col gap-2">
                {upcomingTasks.map(task => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </div>
            ) : (
               <div className="text-center text-sm text-muted-foreground py-4">
                All caught up! No pending missions.
              </div>
            )}
          </CardContent>
        </Card>
      </motion.section>

      {/* Lessons Section */}
      <motion.section className="space-y-4" variants={itemVariants}>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Lessons</h2>
          <Button variant="ghost" asChild>
            <Link href="/tasks">
              See All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {subjects.slice(0, 4).map((subject, i) => (
             <motion.div
              key={subject.name}
              variants={itemVariants}
            >
              <Link href="/tasks">
                <Card className="flex flex-col items-center justify-center p-4 text-center hover:bg-accent transition-colors cursor-pointer group">
                  <subject.icon className="w-8 h-8 mb-2 text-primary transition-transform group-hover:scale-110" />
                  <span className="font-semibold">{subject.name}</span>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
}
