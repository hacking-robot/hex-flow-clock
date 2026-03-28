import { useState, useEffect } from 'react';
import { dateToBlock, blockProgress } from '../lib/timeFormatter';
import type { TimeFormat, BlockRepresentation } from '../lib/timeFormatter';

interface BlockTimeState {
  currentBlock: BlockRepresentation;
  progress: number;
  currentDate: Date;
}

function computeState(format: TimeFormat): BlockTimeState {
  const now = new Date();
  return {
    currentBlock: dateToBlock(now, format),
    progress: blockProgress(now),
    currentDate: now,
  };
}

export function useBlockTime(format: TimeFormat): BlockTimeState {
  const [state, setState] = useState<BlockTimeState>(() => computeState(format));

  useEffect(() => {
    // Recompute immediately when format changes
    setState(computeState(format));

    const id = setInterval(() => {
      setState(computeState(format));
    }, 1000);

    return () => clearInterval(id);
  }, [format]);

  return state;
}
