"use client";

import React, { useState, useEffect } from 'react';
import { useInterval } from '@/hooks/use-interval';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import AddTaskDialog from './components/add-task-dialog';

const subjects = [
  "Filipino", "English", "Math", "Science",
  "TLE", "MAPEH", "A.P.", "Values Ed."
];

export default function Home() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useInterval(() => {
    setCurrentTime(new Date());
  }, 1000);

  return (
    <div className="flex flex-col gap-6 relative h-full">
      {/* Header */}
      <header className="text-center">
        <h1 className="text-5xl font-bold font-mono tracking-widest text-primary">
          {format(currentTime, 'HH:mm:ss')}
        </h1>
        <p className="text-muted-foreground">4/8 Subjects Cleared</p>
      </header>

      {/* Grid of Subjects */}
      <main className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-grow">
        {subjects.map((subject) => (
          <Card 
            key={subject} 
            className="aspect-square flex items-center justify-center p-4 text-center border-primary/50 border-2 hover:bg-accent transition-colors cursor-pointer"
          >
            <span className="font-semibold text-lg">{subject}</span>
          </Card>
        ))}
      </main>

      {/* Floating Action Button */}
      <div className="absolute bottom-8 right-8">
        <AddTaskDialog />
      </div>
    </div>
  );
}
