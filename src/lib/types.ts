import { Book, TestTube, Globe } from 'lucide-react';

export interface Task {
  id: string;
  subject: string;
  taskName: string;
  dueDate: string;
  isCompleted: boolean;
}

export const subjects = [
  { name: "Filipino", icon: Book },
  { name: "English", icon: Book },
  { name: "Math", icon: TestTube },
  { name: "Science", icon: TestTube },
  { name: "TLE", icon: Globe },
  { name: "MAPEH", icon: Globe },
  { name: "A.P.", icon: Globe },
  { name: "Values Ed.", icon: Globe },
];
