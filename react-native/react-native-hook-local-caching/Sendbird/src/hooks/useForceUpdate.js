import { useCallback, useState } from 'react';

export const useForceUpdate = () => {
  const [, updater] = useState(0);
  return useCallback(() => updater(prev => prev + 1), []);
};
