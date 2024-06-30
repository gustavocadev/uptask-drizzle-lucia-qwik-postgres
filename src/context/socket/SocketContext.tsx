import {
  type Signal,
  createContextId,
  type NoSerialize,
} from '@builder.io/qwik';

type SocketClient = {
  socket: Signal<NoSerialize<WebSocket>>;
  isOnline: Signal<boolean>;
};

export const SocketContext = createContextId<SocketClient>('socket.context');
