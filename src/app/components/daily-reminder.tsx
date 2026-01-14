"use client";

import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useInterval } from '@/hooks/use-interval';

const NOTIFICATION_HOUR = 20; // 8 PM in 24-hour format

export default function DailyReminder() {
  const { toast } = useToast();
  const [lastNotificationDate, setLastNotificationDate] = useState<string | null>(null);

  // Load the last notification date from localStorage on component mount
  useEffect(() => {
    const storedDate = localStorage.getItem('lastNotificationDate');
    if (storedDate) {
      setLastNotificationDate(storedDate);
    }
  }, []);

  const checkTimeAndNotify = () => {
    const now = new Date();
    const today = now.toDateString();
    
    // Check if it's 8 PM and if a notification hasn't been shown today
    if (now.getHours() === NOTIFICATION_HOUR && today !== lastNotificationDate) {
      toast({
        title: "🚀 Daily Debrief",
        description: "It's 8 PM! Time to log your missions for the day. Open the vault and stay ahead.",
      });
      // Store today's date so we don't notify again
      const newDate = today;
      localStorage.setItem('lastNotificationDate', newDate);
      setLastNotificationDate(newDate);
    }
  };

  // Run the check every minute
  useInterval(checkTimeAndNotify, 60000); 

  return null; // This component doesn't render anything visible
}
