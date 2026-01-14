"use client";

import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';

export default function CalendarPage() {
  const january2026 = new Date(2026, 0, 1);
  const today = new Date(2026, 0, 15);

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-3xl font-bold">Calendar</h1>
        <p className="text-muted-foreground">A static view of January 2026.</p>
      </header>
      <Card className="self-center w-auto">
        <Calendar
          month={january2026}
          selected={today}
          onSelect={() => {}} // Static calendar, no interaction needed
          classNames={{
            day_selected: "bg-primary text-primary-foreground rounded-full hover:bg-primary/90 focus:bg-primary focus:text-primary-foreground",
            day_today: "bg-accent text-accent-foreground rounded-md", // Style the actual 'today' differently
          }}
        />
      </Card>
    </div>
  );
}
