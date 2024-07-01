import {
  type NoSerialize,
  Slot,
  component$,
  noSerialize,
  useContextProvider,
  useVisibleTask$,
  useSignal,
  useStore,
} from '@builder.io/qwik';
import { SocketContext } from './SocketContext';

const useSocket = (serverPath: string) => {
  const socket = useSignal<NoSerialize<WebSocket>>(undefined);
  const isOnline = useSignal<boolean>(false);

  // this need to be initialized on the client only
  useVisibleTask$(({ cleanup }) => {
    const ws = new WebSocket(serverPath);
    socket.value = noSerialize(ws);

    ws.addEventListener('open', () => {
      isOnline.value = true;
    });

    ws.addEventListener('close', () => {
      isOnline.value = false;
    });

    cleanup(() => {
      ws.close();
    });
  });

  return {
    socket,
    isOnline,
  };
};

export const SocketProvider = component$(() => {
  // my global state
  const { socket, isOnline } = useSocket(
    import.meta.env.PUBLIC_WEBSOCKET_SERVER_URL!
  );

  // my providers
  useContextProvider(
    SocketContext,
    useStore({
      socket,
      isOnline,
    })
  );
  return <Slot />;
});
