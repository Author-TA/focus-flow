export interface Task {
  id: string;
  title: string;
  description: string;
  dueTime?: string;
  filter: 'tomorrow' | 'later';
  status: 'active' | 'completed' | 'deleted';
  createdAt: string;
  completedAt?: string;
  deletedAt?: string;
  order: number;
}

export type FilterType = 'tomorrow' | 'later';
export type ViewType = 'focus' | 'tasks';
