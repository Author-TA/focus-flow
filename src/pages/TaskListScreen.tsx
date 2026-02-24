import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { Plus, Trophy, Trash2, Settings } from 'lucide-react';
import { FilterType, Task } from '@/types/task';
import { TaskItem } from '@/components/TaskItem';
import { TaskCreation } from '@/components/TaskCreation';
import { AchievementsSheet } from '@/components/AchievementsSheet';
import { DeletedSheet } from '@/components/DeletedSheet';
import { SettingsSheet } from '@/components/SettingsSheet';

interface TaskListScreenProps {
  tasks: Task[];
  getActiveTasks: (filter: FilterType) => Task[];
  getCompletedTasks: () => Task[];
  getDeletedTasks: () => Task[];
  addTask: (title: string, description: string, dueTime?: string, filter?: FilterType) => void;
  deleteTask: (id: string) => void;
  reorderTasks: (filter: FilterType, ids: string[]) => void;
  resetAll: () => void;
}

export default function TaskListScreen({
  tasks,
  getActiveTasks,
  getCompletedTasks,
  getDeletedTasks,
  addTask,
  deleteTask,
  reorderTasks,
  resetAll,
}: TaskListScreenProps) {
  const [filter, setFilter] = useState<FilterType>('tomorrow');
  const [showCreate, setShowCreate] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const activeTasks = getActiveTasks(filter);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = activeTasks.findIndex(t => t.id === active.id);
    const newIndex = activeTasks.findIndex(t => t.id === over.id);
    const reordered = arrayMove(activeTasks, oldIndex, newIndex);
    reorderTasks(filter, reordered.map(t => t.id));
  };

  return (
    <div className="flex flex-col h-full">
      <AnimatePresence>
        {showCreate && (
          <TaskCreation
            onAdd={addTask}
            onClose={() => setShowCreate(false)}
            currentFilter={filter}
          />
        )}
        {showAchievements && (
          <AchievementsSheet
            tasks={getCompletedTasks()}
            onClose={() => setShowAchievements(false)}
          />
        )}
        {showDeleted && (
          <DeletedSheet
            tasks={getDeletedTasks()}
            onClose={() => setShowDeleted(false)}
          />
        )}
        {showSettings && (
          <SettingsSheet
            tasks={tasks}
            onReset={resetAll}
            onClose={() => setShowSettings(false)}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="px-4 pt-4 pb-2 safe-top">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-foreground">Tasks</h1>
          <button onClick={() => setShowSettings(true)} className="p-2 text-muted-foreground">
            <Settings className="w-5 h-5" />
          </button>
        </div>
        <div className="flex gap-2">
          {(['tomorrow', 'later'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground'
              }`}
            >
              {f === 'tomorrow' ? 'Tomorrow' : 'Later'}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-auto px-4 py-4">
        {activeTasks.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm mt-8">
            No tasks in {filter === 'tomorrow' ? 'Tomorrow' : 'Later'}
          </p>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={activeTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
              {activeTasks.map(task => (
                <TaskItem key={task.id} task={task} onDelete={deleteTask} />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Bottom Bar */}
      <div className="pb-6 safe-bottom px-4 flex items-center justify-between">
        <button
          onClick={() => setShowDeleted(true)}
          className="p-3 text-muted-foreground"
        >
          <Trash2 className="w-5 h-5" />
        </button>

        <button
          onClick={() => setShowCreate(true)}
          className="w-14 h-14 rounded-full bg-primary flex items-center justify-center glow-primary"
        >
          <Plus className="w-6 h-6 text-primary-foreground" />
        </button>

        <button
          onClick={() => setShowAchievements(true)}
          className="p-3 text-muted-foreground"
        >
          <Trophy className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
