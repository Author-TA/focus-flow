import { useState, useCallback, useEffect } from 'react';
import { Task, FilterType } from '@/types/task';

const STORAGE_KEY = 'momentum_tasks';

function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveTasks(tasks: Task[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export function useTaskStore() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const addTask = useCallback((title: string, description: string, dueTime?: string, filter: FilterType = 'tomorrow') => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      description,
      dueTime,
      filter,
      status: 'active',
      createdAt: new Date().toISOString(),
      order: 0,
    };
    setTasks(prev => {
      const filtered = prev.filter(t => t.status === 'active' && t.filter === filter);
      const reordered = filtered.map(t => ({ ...t, order: t.order + 1 }));
      const others = prev.filter(t => !(t.status === 'active' && t.filter === filter));
      return [newTask, ...reordered, ...others];
    });
  }, []);

  const completeTask = useCallback((id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'completed', completedAt: new Date().toISOString() } : t));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'deleted', deletedAt: new Date().toISOString() } : t));
  }, []);

  const recoverTask = useCallback((id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'active', deletedAt: undefined } : t));
  }, []);

  const reorderTasks = useCallback((filter: FilterType, reorderedIds: string[]) => {
    setTasks(prev => {
      const updated = [...prev];
      reorderedIds.forEach((id, index) => {
        const task = updated.find(t => t.id === id);
        if (task) task.order = index;
      });
      return updated;
    });
  }, []);

  const moveToFilter = useCallback((id: string, filter: FilterType) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, filter } : t));
  }, []);

  const resetAll = useCallback(() => {
    setTasks([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const getActiveTasks = useCallback((filter: FilterType) => {
    return tasks.filter(t => t.status === 'active' && t.filter === filter).sort((a, b) => a.order - b.order);
  }, [tasks]);

  const getCompletedTasks = useCallback(() => {
    return tasks.filter(t => t.status === 'completed').sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime());
  }, [tasks]);

  const getDeletedTasks = useCallback(() => {
    return tasks.filter(t => t.status === 'deleted').sort((a, b) => new Date(b.deletedAt!).getTime() - new Date(a.deletedAt!).getTime());
  }, [tasks]);

  const getFirstTomorrowTask = useCallback(() => {
    const tomorrow = tasks.filter(t => t.status === 'active' && t.filter === 'tomorrow').sort((a, b) => a.order - b.order);
    return tomorrow[0] || null;
  }, [tasks]);

  return {
    tasks,
    addTask,
    completeTask,
    deleteTask,
    recoverTask,
    reorderTasks,
    moveToFilter,
    resetAll,
    getActiveTasks,
    getCompletedTasks,
    getDeletedTasks,
    getFirstTomorrowTask,
  };
}
