import { motion } from 'framer-motion';
import { X, Download, RotateCcw } from 'lucide-react';
import { Task } from '@/types/task';
import { exportTasksToCSV } from '@/utils/csvExport';
import { useState } from 'react';

interface SettingsSheetProps {
  tasks: Task[];
  onReset: () => void;
  onClose: () => void;
}

export function SettingsSheet({ tasks, onReset, onClose }: SettingsSheetProps) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const exportFiltered = (filter: string) => {
    let filtered: Task[];
    switch (filter) {
      case 'tomorrow':
        filtered = tasks.filter(t => t.status === 'active' && t.filter === 'tomorrow');
        break;
      case 'later':
        filtered = tasks.filter(t => t.status === 'active' && t.filter === 'later');
        break;
      case 'completed':
        filtered = tasks.filter(t => t.status === 'completed');
        break;
      case 'deleted':
        filtered = tasks.filter(t => t.status === 'deleted');
        break;
      default:
        filtered = tasks;
    }
    exportTasksToCSV(filtered, `momentum-${filter}-${new Date().toISOString().split('T')[0]}`);
  };

  return (
    <motion.div
      className="fixed inset-0 z-30 bg-background flex flex-col"
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
    >
      <div className="flex items-center justify-between px-4 py-4 safe-top">
        <h2 className="text-lg font-bold text-foreground">Settings</h2>
        <button onClick={onClose} className="p-2 text-muted-foreground">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-auto px-4 pb-8 space-y-6">
        {/* Export Section */}
        <div>
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Export as CSV</h3>
          <div className="space-y-2">
            {['all', 'tomorrow', 'later', 'completed', 'deleted'].map(filter => (
              <button
                key={filter}
                onClick={() => exportFiltered(filter)}
                className="flex items-center gap-3 w-full bg-card border border-border rounded-xl p-3 text-sm text-foreground"
              >
                <Download className="w-4 h-4 text-primary" />
                <span className="capitalize">{filter} Tasks</span>
              </button>
            ))}
          </div>
        </div>

        {/* Reset Section */}
        <div>
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Data</h3>
          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center gap-3 w-full bg-card border border-destructive/30 rounded-xl p-3 text-sm text-destructive"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset All Data</span>
            </button>
          ) : (
            <div className="bg-card border border-destructive rounded-xl p-4">
              <p className="text-sm text-foreground mb-3">Are you sure? This cannot be undone.</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => { onReset(); onClose(); }}
                  className="flex-1 py-2 rounded-lg bg-destructive text-destructive-foreground text-sm"
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="text-center pt-4">
          <p className="text-xs text-muted-foreground">Momentum</p>
          <p className="text-xs text-muted-foreground/50">All data stored locally</p>
        </div>
      </div>
    </motion.div>
  );
}
