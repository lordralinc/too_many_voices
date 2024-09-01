import React from 'react';

export default function useLimitedList<T>(
  init: T[],
  limit: number,
): [T[], (item: T) => void] {
  const [value, setValue] = React.useState<T[]>(init);

  const addValue = React.useCallback(
    (item: T) => {
      setValue((prev) => {
        const newItems = [...prev, item];
        if (newItems.length > limit) {
          newItems.shift();
        }
        return newItems;
      });
    },
    [limit],
  );

  return [value, addValue];
}
