import { PageHeader } from '@/components/ui/PageHeader';
import { TaskForm, addTask } from '@/features/task-list';
import { useNavigate } from 'react-router-dom';

export const NewTaskPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <PageHeader>New Task</PageHeader>
      <TaskForm
        onSubmit={newTask => {
          addTask(newTask);
          navigate('/tasks');
        }}
      />
    </>
  );
};
