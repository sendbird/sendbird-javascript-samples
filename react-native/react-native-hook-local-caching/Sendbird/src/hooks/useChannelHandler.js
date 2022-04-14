import { useEffect } from 'react';

export const useChannelHandler = (sdk, handlerId, hookHandler, deps = []) => {
  useEffect(() => {
    const handler = new sdk.ChannelHandler();
    const handlerKeys = Object.keys(handler);
    handlerKeys.forEach(key => {
      const hookHandlerFn = hookHandler[key];
      if (hookHandlerFn) handler[key] = hookHandlerFn;
    });

    sdk.addChannelHandler(handlerId, handler);
    return () => sdk.removeChannelHandler(handlerId);
  }, [sdk, handlerId, ...deps]);
};
