import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTaskStore } from '@/hooks/useTaskStore';
import { useTheme } from '@/hooks/useTheme';
import FocusScreen from '@/pages/FocusScreen';
import TaskListScreen from '@/pages/TaskListScreen';
import { Zap, ListTodo } from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'focus' | 'tasks'>('focus');
  const store = useTaskStore();
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden max-w-md mx-auto relative">
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'focus' ? (
            <motion.div
              key="focus"
              className="h-full"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <FocusScreen
                firstTask={store.getFirstTomorrowTask()}
                onComplete={store.completeTask}
                onDelete={store.deleteTask}
              />
            </motion.div>
          ) : (
            <motion.div
              key="tasks"
              className="h-full"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <TaskListScreen
                tasks={store.tasks}
                getActiveTasks={store.getActiveTasks}
                getCompletedTasks={store.getCompletedTasks}
                getDeletedTasks={store.getDeletedTasks}
                addTask={store.addTask}
                deleteTask={store.deleteTask}
                recoverTask={store.recoverTask}
                reorderTasks={store.reorderTasks}
                resetAll={store.resetAll}
                isDark={isDark}
                onToggleTheme={toggleTheme}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tab Bar */}
      <div className="border-t border-border bg-background/90 backdrop-blur-lg safe-bottom">
        <div className="flex">
          <button
            onClick={() => setActiveTab('focus')}
            className={`flex-1 flex flex-col items-center py-3 gap-1 transition-colors ${
              activeTab === 'focus' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <Zap className="w-5 h-5" />
            <span className="text-[10px] font-medium">Focus</span>
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex-1 flex flex-col items-center py-3 gap-1 transition-colors ${
              activeTab === 'tasks' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <ListTodo className="w-5 h-5" />
            <span className="text-[10px] font-medium">Tasks</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;
