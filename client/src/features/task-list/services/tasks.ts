import { Task } from '../constants/types';

const LOCAL_STORAGE_KEY = 'tasks';

export const getTasks = (): Task[] => {
  const tasks = localStorage.getItem(LOCAL_STORAGE_KEY);

  if (tasks == null) return [];

  return JSON.parse(tasks);
};

export const addTask = (task: Omit<Task, 'id'>) => {
  const tasks = getTasks();

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([...tasks, { id: crypto.randomUUID(), ...task }]));
};

export const removeTask = (id: string) => {
  const tasks = getTasks();

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks.filter(task => task.id !== id)));
};

export const updateTask = (id: string, taskFields: Partial<Task>) => {
  const tasks = getTasks();

  localStorage.setItem(
    LOCAL_STORAGE_KEY,
    JSON.stringify(
      tasks.map(task => {
        if (task.id === id) return { ...task, ...taskFields };
        return task;
      })
    )
  );
};
