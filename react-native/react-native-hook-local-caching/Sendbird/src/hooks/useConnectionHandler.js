import { useEffect } from 'react';

export const useConnectionHandler = (sdk, handlerId, hookHandler, deps = []) => {
  useEffect(() => {
    const handler = new sdk.ConnectionHandler();
    const handlerKeys = Object.keys(handler);
    handlerKeys.forEach(key => {
      const hookHandlerFn = hookHandler[key];
      if (hookHandlerFn) handler[key] = hookHandlerFn;
    });

    sdk.addConnectionHandler(handlerId, handler);
    return () => sdk.removeConnectionHandler(handlerId);
  }, [sdk, handlerId, ...deps]);
};
