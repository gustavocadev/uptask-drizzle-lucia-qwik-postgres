import {
  type NoSerialize,
  Slot,
  component$,
  noSerialize,
  useContextProvider,
  useVisibleTask$,
  useSignal,
  useComputed$,
} from '@builder.io/qwik';
import { SocketContext } from './SocketContext';
import { type Socket, io } from 'socket.io-client';

export const useSocket = (serverPath: string) => {
  const socket = useSignal<NoSerialize<Socket>>(undefined);

  useVisibleTask$(({ cleanup }) => {
    const connection = io(serverPath);

    socket.value = noSerialize(connection);

    cleanup(() => {
      connection.close();
    });
  });

  const isOnline = useComputed$(() => (socket.value?.connected ? true : false));

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
