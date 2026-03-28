import { useState, useEffect } from 'react';
import { dateToBlock, blockProgress } from '../lib/timeFormatter';
import type { BlockRepresentation, BlockConfig } from '../lib/timeFormatter';

interface BlockTimeState {
  currentBlock: BlockRepresentation;
  progress: number;
  currentDate: Date;
}

function computeState(config: BlockConfig): BlockTimeState {
  const now = new Date();
  return {
    currentBlock: dateToBlock(now, config),
    progress: blockProgress(now, config),
    currentDate: now,
  };
}

export function useBlockTime(config: BlockConfig): BlockTimeState {
  const [state, setState] = useState<BlockTimeState>(() => computeState(config));

  useEffect(() => {
    setState(computeState(config));
    const id = setInterval(() => setState(computeState(config)), 1000);
    return () => clearInterval(id);
  }, [config.blockMinutes, config.startMinute]);

  return state;
}
