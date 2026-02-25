import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';
import { Task } from '@/types/task';

interface TaskItemProps {
  task: Task;
  onDelete: (id: string) => void;
  onTap: (task: Task) => void;
}

export function TaskItem({ task, onDelete, onTap }: TaskItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 bg-card border border-border rounded-xl p-4 mb-2"
    >
      <button
        className="touch-none text-muted-foreground hover:text-foreground shrink-0"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="w-4 h-4" />
      </button>
      <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onTap(task)}>
        <h3 className="font-semibold text-foreground text-sm truncate">{task.title}</h3>
        {task.description && (
          <p className="text-xs text-muted-foreground truncate mt-0.5">{task.description}</p>
        )}
        {task.dueTime && (
          <p className="text-xs text-primary mt-1">{task.dueTime}</p>
        )}
      </div>
      <button
        onClick={() => onDelete(task.id)}
        className="text-muted-foreground hover:text-destructive shrink-0 p-1"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
