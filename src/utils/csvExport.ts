import { Task } from '@/types/task';

export function exportTasksToCSV(tasks: Task[], filename: string) {
  const headers = ['Title', 'Description', 'Due Time', 'Filter', 'Status', 'Created', 'Completed', 'Deleted'];
  const rows = tasks.map(t => [
    `"${t.title.replace(/"/g, '""')}"`,
    `"${t.description.replace(/"/g, '""').replace(/\n/g, ' ')}"`,
    t.dueTime || '',
    t.filter,
    t.status,
    t.createdAt,
    t.completedAt || '',
    t.deletedAt || '',
  ]);

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
