import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause } from 'lucide-react';
import { Task } from '@/types/task';
import { CelebrationAnimation } from '@/components/CelebrationAnimation';

interface FocusScreenProps {
  firstTask: Task | null;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function FocusScreen({ firstTask, onComplete, onDelete }: FocusScreenProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [swipeX, setSwipeX] = useState(0);
  const [swipeRightX, setSwipeRightX] = useState(0);
  const touchStartX = useRef(0);
  const activeTask = isPlaying ? firstTask : null;

  const handlePlay = () => {
    if (firstTask) setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
    setSwipeX(0);
    setSwipeRightX(0);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.touches[0].clientX;
    if (diff > 0) {
      setSwipeX(Math.min(diff, 200));
      setSwipeRightX(0);
    } else {
      setSwipeRightX(Math.min(-diff, 200));
      setSwipeX(0);
    }
  };

  const handleTouchEnd = () => {
    if (swipeX > 100) {
      setShowConfirm(true);
    }
    if (swipeRightX > 100 && activeTask) {
      onDelete(activeTask.id);
      // Stay playing — next task will auto-show
      setSwipeRightX(0);
      setSwipeX(0);
      return;
    }
    setSwipeX(0);
    setSwipeRightX(0);
  };

  const handleConfirmYes = useCallback(() => {
    if (activeTask) {
      setShowConfirm(false);
      setShowCelebration(true);
    }
  }, [activeTask]);

  const handleConfirmNo = () => {
    setShowConfirm(false);
    // Stay playing, don't reset
  };

  const handleCelebrationComplete = useCallback(() => {
    if (activeTask) {
      onComplete(activeTask.id);
    }
    setShowCelebration(false);
    // Stay playing — next task will auto-show via firstTask prop
  }, [activeTask, onComplete]);

  return (
    <div className="flex flex-col h-full relative">
      <AnimatePresence>
        {showCelebration && (
          <CelebrationAnimation onComplete={handleCelebrationComplete} />
        )}
      </AnimatePresence>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={handleConfirmNo} />
            <motion.div
              className="relative z-10 bg-card border border-border rounded-2xl p-6 mx-6 w-full max-w-sm"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 className="text-lg font-semibold text-foreground text-center mb-6">Is it completed?</h3>
              <div className="flex gap-3">
                <button
                  onClick={handleConfirmNo}
                  className="flex-1 py-3 rounded-xl bg-secondary text-secondary-foreground font-medium"
                >
                  No
                </button>
                <button
                  onClick={handleConfirmYes}
                  className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-medium"
                >
                  Yes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <AnimatePresence mode="wait">
          {activeTask ? (
            <motion.div
              key={activeTask.id}
              className="w-full max-w-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <motion.div
                className="bg-card border border-border rounded-2xl p-6 relative overflow-hidden"
                style={{ x: swipeRightX > 0 ? swipeRightX : -swipeX }}
              >
                {/* Left swipe indicator (complete) */}
                {swipeX > 0 && (
                  <div
                    className="absolute right-0 top-0 bottom-0 flex items-center justify-center bg-success/20"
                    style={{ width: swipeX }}
                  >
                    <span className="text-success text-xs font-medium">✓ Done</span>
                  </div>
                )}

                {/* Right swipe indicator (delete) */}
                {swipeRightX > 0 && (
                  <div
                    className="absolute left-0 top-0 bottom-0 flex items-center justify-center bg-destructive/20"
                    style={{ width: swipeRightX }}
                  >
                    <span className="text-destructive text-xs font-medium">🗑 Delete</span>
                  </div>
                )}

                <h2 className="text-xl font-bold text-foreground mb-3">{activeTask.title}</h2>
                {activeTask.description && (
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 whitespace-pre-wrap">
                    {activeTask.description}
                  </p>
                )}
                {activeTask.dueTime && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {activeTask.dueTime}
                  </div>
                )}

                <p className="text-xs text-muted-foreground mt-4 text-center">← Complete · Delete →</p>
              </motion.div>
            </motion.div>
          ) : isPlaying && !firstTask ? (
            <motion.div
              key="no-more"
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-2">All done! 🎉</h2>
              <p className="text-muted-foreground text-sm">No more tasks in your Tomorrow list</p>
            </motion.div>
          ) : (
            <motion.div
              key="ready"
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-2">Ready to begin?</h2>
              <p className="text-muted-foreground text-sm">
                {firstTask ? 'Press play to focus on your next task' : 'Add tasks to get started'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Control Button */}
      <div className="pb-8 safe-bottom flex justify-center">
        {isPlaying ? (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handlePause}
            className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center"
          >
            <Pause className="w-6 h-6 text-secondary-foreground" />
          </motion.button>
        ) : (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handlePlay}
            className={`w-16 h-16 rounded-full bg-primary flex items-center justify-center glow-primary ${!firstTask ? 'opacity-40' : 'animate-pulse-glow'}`}
            disabled={!firstTask}
          >
            <Play className="w-6 h-6 text-primary-foreground ml-0.5" />
          </motion.button>
        )}
      </div>
    </div>
  );
}
