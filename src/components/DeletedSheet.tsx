import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Task } from '@/types/task';
import { format } from 'date-fns';

interface DeletedSheetProps {
  tasks: Task[];
  onClose: () => void;
}

export function DeletedSheet({ tasks, onClose }: DeletedSheetProps) {
  return (
    <motion.div
      className="fixed inset-0 z-30 bg-background flex flex-col"
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
    >
      <div className="flex items-center justify-between px-4 py-4 safe-top">
        <h2 className="text-lg font-bold text-foreground">Deleted Tasks</h2>
        <button onClick={onClose} className="p-2 text-muted-foreground">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-auto px-4 pb-8">
        {tasks.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm mt-8">No deleted tasks</p>
        ) : (
          tasks.map(task => (
            <div key={task.id} className="bg-card border border-border rounded-xl p-3 mb-2">
              <h4 className="text-sm font-semibold text-foreground">{task.title}</h4>
              {task.deletedAt && (
                <p className="text-xs text-destructive mt-1">
                  Deleted {format(new Date(task.deletedAt), 'MMM d, h:mm a')}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}
