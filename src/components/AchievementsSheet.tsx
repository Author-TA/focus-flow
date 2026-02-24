import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Task } from '@/types/task';
import { useState } from 'react';
import { format, startOfMonth, endOfMonth, startOfYear, endOfYear, isWithinInterval, subYears } from 'date-fns';

interface AchievementsSheetProps {
  tasks: Task[];
  onClose: () => void;
}

type AchievementsFilter = 'month' | 'year' | 'history';

export function AchievementsSheet({ tasks, onClose }: AchievementsSheetProps) {
  const [filter, setFilter] = useState<AchievementsFilter>('month');
  const now = new Date();

  const getFilteredTasks = () => {
    switch (filter) {
      case 'month':
        return tasks.filter(t =>
          t.completedAt && isWithinInterval(new Date(t.completedAt), {
            start: startOfMonth(now),
            end: endOfMonth(now),
          })
        );
      case 'year':
        return tasks.filter(t =>
          t.completedAt && isWithinInterval(new Date(t.completedAt), {
            start: startOfYear(now),
            end: endOfYear(now),
          })
        );
      case 'history':
        return tasks.filter(t =>
          t.completedAt && isWithinInterval(new Date(t.completedAt), {
            start: subYears(now, 2),
            end: now,
          })
        );
      default:
        return tasks;
    }
  };

  const filteredTasks = getFilteredTasks();

  // Group by month
  const grouped = filteredTasks.reduce<Record<string, Task[]>>((acc, task) => {
    const key = format(new Date(task.completedAt!), 'MMMM yyyy');
    if (!acc[key]) acc[key] = [];
    acc[key].push(task);
    return acc;
  }, {});

  return (
    <motion.div
      className="fixed inset-0 z-30 bg-background flex flex-col"
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
    >
      <div className="flex items-center justify-between px-4 py-4 safe-top">
        <h2 className="text-lg font-bold text-foreground">Achievements</h2>
        <button onClick={onClose} className="p-2 text-muted-foreground">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 px-4 mb-4">
        {(['month', 'year', 'history'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === f
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground'
            }`}
          >
            {f === 'month' ? 'This Month' : f === 'year' ? 'This Year' : 'History'}
          </button>
        ))}
      </div>

      {/* Tasks */}
      <div className="flex-1 overflow-auto px-4 pb-8">
        {Object.keys(grouped).length === 0 ? (
          <p className="text-center text-muted-foreground text-sm mt-8">No completed tasks yet</p>
        ) : (
          Object.entries(grouped).map(([month, monthTasks]) => (
            <div key={month} className="mb-6">
              <h3 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">{month}</h3>
              {monthTasks.map(task => (
                <div key={task.id} className="bg-card border border-border rounded-xl p-3 mb-2">
                  <h4 className="text-sm font-semibold text-foreground">{task.title}</h4>
                  {task.completedAt && (
                    <p className="text-xs text-success mt-1">
                      ✓ {format(new Date(task.completedAt), 'MMM d, h:mm a')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}
