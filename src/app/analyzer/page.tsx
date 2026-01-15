'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { analyzeLas, type LasAnalysisOutput } from '@/ai/flows/las-analyzer-flow';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { UploadCloud, Loader2 } from 'lucide-react';
import { subjects } from '@/lib/types';
import AnalysisResult from './analysis-result';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  subject: z.string().min(1, { message: 'Subject is required.' }),
  image: z.instanceof(File).refine(file => file.size > 0, 'An image is required.'),
});

export default function AnalyzerPage() {
  const [analysisResult, setAnalysisResult] = useState<LasAnalysisOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: '',
      image: new File([], ''),
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('image', file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const toDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setAnalysisResult(null);

    try {
      const photoDataUri = await toDataUri(values.image);
      const result = await analyzeLas({
        subject: values.subject,
        photoDataUri,
      });
      setAnalysisResult(result);
    } catch (error) {
      console.error('Analysis failed:', error);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'The AI could not process the image. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-3xl font-bold">Vanguard AI Analyzer</h1>
        <p className="text-muted-foreground">Upload a Learning Activity Sheet to get an AI-powered analysis.</p>
      </header>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="flex flex-col">
          <CardContent className="p-6 flex-grow">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full space-y-6">
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormLabel>LAS Image</FormLabel>
                      <FormControl>
                        <div
                          className="relative flex flex-col items-center justify-center w-full h-full border-2 border-dashed rounded-lg cursor-pointer border-border hover:border-primary transition-colors"
                          onDragOver={e => e.preventDefault()}
                          onDrop={e => {
                            e.preventDefault();
                            const file = e.dataTransfer.files?.[0];
                            if (file) {
                              form.setValue('image', file);
                              setPreviewUrl(URL.createObjectURL(file));
                            }
                          }}
                        >
                          {previewUrl ? (
                            <img src={previewUrl} alt="LAS Preview" className="object-contain w-full h-full max-h-80 rounded-lg" />
                          ) : (
                            <div className="text-center p-8">
                              <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                              <p className="mt-2 text-sm text-muted-foreground">
                                <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                              </p>
                              <p className="text-xs text-muted-foreground">PNG, JPG or GIF</p>
                            </div>
                          )}
                          <input
                            id="file-upload"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleFileChange}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a subject" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {subjects.map(subject => (
                            <SelectItem key={subject.name} value={subject.name}>{subject.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Analyze LAS
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <AnalysisResult result={analysisResult} isLoading={isLoading} />

      </div>
    </div>
  );
}
