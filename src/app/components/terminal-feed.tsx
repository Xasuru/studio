"use client";

import React, { useState, useEffect } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit, Timestamp } from 'firebase/firestore';
import { AnimatePresence, motion } from 'framer-motion';
import { useInterval } from '@/hooks/use-interval';
import { cn } from '@/lib/utils';


interface Log {
  id: string;
  timestamp: Timestamp;
  subject: string;
  action: string;
}

const MAX_LOGS = 5;

const Typewriter = ({ text, onComplete }: { text: string; onComplete: () => void }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let i = 0;
    const intervalId = setInterval(() => {
      setDisplayedText(text.substring(0, i + 1));
      i++;
      if (i > text.length) {
        clearInterval(intervalId);
        onComplete();
      }
    }, 20); // Adjust typing speed here
    return () => clearInterval(intervalId);
  }, [text, onComplete]);

  return <span>{displayedText}</span>;
};


export default function TerminalFeed() {
  const firestore = useFirestore();
  const logsQuery = useMemoFirebase(
    () =>
      firestore
        ? query(collection(firestore, 'logs'), orderBy('timestamp', 'desc'), limit(MAX_LOGS))
        : null,
    [firestore]
  );
  const { data: logs, isLoading } = useCollection<Log>(logsQuery);
  const [flicker, setFlicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);


  useInterval(() => {
     setFlicker(prev => !prev);
  }, 200 + Math.random() * 200);

  useEffect(() => {
    if (logs && logs.length > 0) {
      setIsTyping(true);
    }
  }, [logs]);


  const formatTimestamp = (timestamp: Timestamp | null | undefined): string => {
    if (!timestamp) return '...';
    return `[${new Date(timestamp.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}]`;
  };
  
  const sortedLogs = logs ? [...logs].sort((a, b) => a.timestamp?.seconds - b.timestamp?.seconds) : [];

  return (
    <div className="font-code bg-black/50 rounded-lg border border-border p-4 h-48 flex flex-col justify-end text-sm">
      <AnimatePresence>
        {isLoading && <div className="text-primary">SYSTEM INITIALIZED...</div>}
        {sortedLogs.map((log, index) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: flicker ? 0.95 : 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex gap-2"
          >
            <span className="text-muted-foreground">{formatTimestamp(log.timestamp)}</span>
            
            {index === sortedLogs.length - 1 && isTyping ? (
              <span className={cn('text-primary', log.action.includes("DETECTED") && 'text-destructive')}>
                 <Typewriter text={`${log.subject}: ${log.action}`} onComplete={() => setIsTyping(false)} />
              </span>
            ) : (
               <span className={cn('text-primary', log.action.includes("DETECTED") && 'text-destructive')}>{log.subject}: {log.action}</span>
            )}

          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
