'use client';

import React, { useState, useEffect } from 'react';
import { type LasAnalysisOutput } from '@/ai/flows/las-analyzer-flow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const Typewriter = ({ text, onComplete }: { text: string; onComplete?: () => void }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText(''); // Reset on new text
    let i = 0;
    const intervalId = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(prev => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(intervalId);
        if (onComplete) {
          onComplete();
        }
      }
    }, 10);
    return () => clearInterval(intervalId);
  }, [text, onComplete]);

  return <>{displayedText}</>;
};

const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div>
        <h3 className="font-code uppercase text-primary mb-2">{'>'} {title}</h3>
        <div className="font-code text-foreground/90 pl-4 space-y-1">{children}</div>
    </div>
);


export default function AnalysisResult({ result, isLoading }: AnalysisResultProps) {
  if (isLoading) {
    return (
      <Card className="font-code bg-black/80 text-sm">
        <CardHeader>
            <CardTitle className="text-primary/80">
                &gt; ANALYZING...
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="pt-4 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
            </div>
             <div className="pt-4 space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
            </div>
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card className="flex items-center justify-center font-code bg-black/80 text-muted-foreground text-sm h-full">
        <p>&gt; AI response will appear here...</p>
      </Card>
    );
  }

  return (
    <Card className="font-code bg-black/80 text-sm">
        <CardHeader>
            <CardTitle className="text-primary">
               <Typewriter text={`> SUBJECT: ${result.subject.toUpperCase()} | LAS #: ${result.lasNumber}`} />
            </CardTitle>
        </CardHeader>
      <CardContent className="space-y-6">
        <Section title="TARGET">
            <p><Typewriter text={result.learningTarget} /></p>
        </Section>
        
        <Section title="DETAILED SOLUTIONS">
            {result.detailedSolutions.map((step, index) => (
                <p key={index}><Typewriter text={step} /></p>
            ))}
        </Section>

        <Section title="FINAL ANSWERS">
            {result.finalAnswers.map((answer, index) => (
                <p key={index}><Typewriter text={answer} /></p>
            ))}
        </Section>

        <div className="pt-4">
            <p className="font-code text-primary/70 text-xs"><Typewriter text={`> SYSTEM NOTE: ${result.systemNote}`} /></p>
        </div>
      </CardContent>
    </Card>
  );
}
