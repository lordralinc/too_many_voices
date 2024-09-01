import React from 'react';
import { calculateWidth } from '../../utils';

export default function ProgressBar({
  current,
  max,
  width,
}: {
  current: number;
  max: number;
  width: number;
}) {
  const spanWidth = React.useMemo(
    () => calculateWidth(current, max, width),
    [current, max, width],
  );

  return (
    <div className="self-progress" style={{ width: `${width}px` }}>
      <span
        className="self-progress-value"
        style={{ width: `${spanWidth}px` }}
      />
    </div>
  );
}
