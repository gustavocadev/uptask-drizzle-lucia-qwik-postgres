import {
  type Signal,
  createContextId,
  type NoSerialize,
} from '@builder.io/qwik';
import type { Socket } from 'socket.io-client';

type SocketClient = {
  socket: Signal<NoSerialize<Socket>>;
};

export const SocketContext = createContextId<SocketClient>('socket.context');
