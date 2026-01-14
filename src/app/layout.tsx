import type { Metadata } from 'next';
import './globals.css';
import { TaskManagerProvider } from '@/hooks/use-tasks';
import { Toaster } from '@/components/ui/toaster';
import AppLayout from '@/app/components/app-layout';

export const metadata: Metadata = {
  title: 'Mission Control',
  description: 'A student productivity app for managing Learning Activity Sheets (LAS).',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <TaskManagerProvider>
          <AppLayout>{children}</AppLayout>
          <Toaster />
        </TaskManagerProvider>
      </body>
    </html>
  );
}
