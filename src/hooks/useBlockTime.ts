import { useState, useEffect } from 'react';
import { dateToBlock, subBlockProgress } from '../lib/timeFormatter';
import type { BlockState, BlockConfig } from '../lib/timeFormatter';

interface BlockTimeState {
  current: BlockState;
  progress: number;
  currentDate: Date;
}

function compute(config: BlockConfig): BlockTimeState {
  const now = new Date();
  return {
    current: dateToBlock(now, config),
    progress: subBlockProgress(now, config),
    currentDate: now,
  };
}

export function useBlockTime(config: BlockConfig): BlockTimeState {
  const [state, setState] = useState<BlockTimeState>(() => compute(config));

  useEffect(() => {
    setState(compute(config));
    const id = setInterval(() => setState(compute(config)), 1000);
    return () => clearInterval(id);
  }, [config.blockMinutes, config.subBlockMinutes]);

  return state;
}
