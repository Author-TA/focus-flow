import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { FilterType } from '@/types/task';

interface TaskCreationProps {
  onAdd: (title: string, description: string, dueTime?: string, filter?: FilterType) => void;
  onClose: () => void;
  currentFilter: FilterType;
}

export function TaskCreation({ onAdd, onClose, currentFilter }: TaskCreationProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [isLater, setIsLater] = useState(currentFilter === 'later');

  const handleSubmit = () => {
    if (!title.trim()) return;
    onAdd(title.trim(), description.trim(), dueTime || undefined, isLater ? 'later' : 'tomorrow');
    onClose();
  };

  return (
    <motion.div
      className="fixed inset-0 z-30 bg-background flex flex-col"
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 safe-top">
        <button onClick={onClose} className="p-2 text-muted-foreground">
          <X className="w-5 h-5" />
        </button>
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Later</span>
          <input
            type="checkbox"
            checked={isLater}
            onChange={e => setIsLater(e.target.checked)}
            className="w-4 h-4 rounded border-border accent-primary"
          />
        </label>
      </div>

      {isLater && (
        <p className="text-xs text-muted-foreground px-6 -mt-2 mb-2">
          ✓ This task will be added to the Later list
        </p>
      )}

      {/* Form */}
      <div className="flex-1 px-6 space-y-4 overflow-auto">
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full bg-transparent text-xl font-bold text-foreground placeholder:text-muted-foreground/50 outline-none"
          autoFocus
        />
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={6}
          className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 outline-none resize-none leading-relaxed"
        />
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Due Time (optional)</label>
          <input
            type="time"
            value={dueTime}
            onChange={e => setDueTime(e.target.value)}
            className="bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground"
          />
        </div>
      </div>

      {/* Submit */}
      <div className="pb-8 safe-bottom flex justify-center pt-4">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleSubmit}
          disabled={!title.trim()}
          className="w-14 h-14 rounded-full bg-primary flex items-center justify-center glow-primary disabled:opacity-40 disabled:shadow-none"
        >
          <Check className="w-6 h-6 text-primary-foreground" />
        </motion.button>
      </div>
    </motion.div>
  );
}
