import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground">Manage your account settings.</p>
      </header>
      <Card className="max-w-md mx-auto mt-8">
        <CardHeader className="items-center text-center">
          <Avatar className="w-24 h-24 mb-4">
            <AvatarImage src="https://picsum.photos/seed/student/200" data-ai-hint="person portrait" />
            <AvatarFallback>
              <User className="w-12 h-12" />
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl">Student</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            This is a placeholder profile page. More features coming soon!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
