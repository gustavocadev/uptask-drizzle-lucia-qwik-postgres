import { component$, Slot } from '@builder.io/qwik';
import { SocketProvider } from '~/context/socket/SocketProvider';
import { TaskProvider } from '~/context/task/TaskProvider';

export default component$(() => {
  return (
    <SocketProvider>
      <TaskProvider>
        <Slot />
      </TaskProvider>
    </SocketProvider>
  );
});
