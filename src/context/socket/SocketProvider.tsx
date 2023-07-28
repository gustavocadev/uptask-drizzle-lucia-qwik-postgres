import {
  Slot,
  component$,
  noSerialize,
  useContextProvider,
  useTask$,
  useSignal,
  type NoSerialize,
  useVisibleTask$,
} from '@builder.io/qwik';
import { SocketContext } from './SocketContext';
import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';

export const useSocket = (serverPath: string) => {
  const socket = useSignal<NoSerialize<Socket>>(undefined);

  // important! this always need to be created in the client
  useVisibleTask$(({ track, cleanup }) => {
    track(() => serverPath);
    // this is why qwik cant serialize the instance of socket.io
    const wsClient = io(serverPath);
    socket.value = noSerialize(wsClient);

    return cleanup(() => {
      socket.value?.disconnect();
    });
  });

  const isOnline = useSignal<boolean | undefined>(undefined);

  useTask$(({ track }) => {
    track(() => socket.value);
    socket.value?.on('connect', () => {
      isOnline.value = socket.value?.connected;
    });
  });

  useTask$(({ track }) => {
    track(() => socket.value);
    socket.value?.on('disconnect', () => {
      isOnline.value = socket.value?.connected;
    });
  });

  return {
    socket,
    isOnline,
  };
};

export const SocketProvider = component$(() => {
  // my global state
  const { socket, isOnline } = useSocket(process.env.SOCKET_URL!);

  // my providers
  useContextProvider(SocketContext, {
    socket,
    isOnline,
    // extraHeaders,
  });
  return <Slot />;
});
