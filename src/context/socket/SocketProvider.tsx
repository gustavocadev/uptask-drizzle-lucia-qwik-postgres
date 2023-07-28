import {
  type NoSerialize,
  Slot,
  component$,
  noSerialize,
  useContextProvider,
  useVisibleTask$,
  useSignal,
  useTask$,
} from '@builder.io/qwik';
import { SocketContext } from './SocketContext';
import { type Socket, io } from 'socket.io-client';

export const useSocket = (serverPath: string) => {
  const socket = useSignal<NoSerialize<Socket>>(undefined);

  // this need to be initialized on the client only
  useVisibleTask$(({ cleanup }) => {
    const wsClient = io(serverPath);
    socket.value = noSerialize(wsClient);

    cleanup(() => {
      wsClient.close();
    });
  });

  const isOnline = useSignal<boolean | undefined>(false);

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
  const { socket } = useSocket('/');

  // my providers
  useContextProvider(SocketContext, {
    socket,
  });
  return <Slot />;
});
