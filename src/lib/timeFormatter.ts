/**
 * Core time-formatting logic for the Block Time Clock.
 *
 * Two-level system: blocks (default 90min) divided into sub-blocks (default 15min).
 * Day always starts at 0:00.
 */

const MINUTES_IN_DAY = 1440;

export interface BlockConfig {
  blockMinutes: number;   // e.g. 90
  subBlockMinutes: number; // e.g. 15
}

export interface BlockState {
  block: number;           // 1-based block index
  subBlock: number;        // 1-based sub-block within block
  totalBlocks: number;
  subBlocksPerBlock: number;
  blockStartMinute: number; // absolute minute of day
  blockLabel: string;       // e.g. "13:30"
  minutesInSubBlock: number;
}

function formatMin(m: number): string {
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${h}:${mm.toString().padStart(2, '0')}`;
}

export function totalBlocks(blockMinutes: number): number {
  return Math.ceil(MINUTES_IN_DAY / blockMinutes);
}

export function subBlocksPerBlock(config: BlockConfig): number {
  return Math.ceil(config.blockMinutes / config.subBlockMinutes);
}

export function dateToBlock(date: Date, config: BlockConfig): BlockState {
  const minuteOfDay = date.getHours() * 60 + date.getMinutes();
  const total = totalBlocks(config.blockMinutes);
  const subs = subBlocksPerBlock(config);
  const block = Math.min(Math.floor(minuteOfDay / config.blockMinutes) + 1, total);
  const blockStart = (block - 1) * config.blockMinutes;
  const inBlock = minuteOfDay - blockStart;
  const subBlock = Math.min(Math.floor(inBlock / config.subBlockMinutes) + 1, subs);
  const subStart = blockStart + (subBlock - 1) * config.subBlockMinutes;
  const minutesInSub = minuteOfDay - subStart;
  return {
    block,
    subBlock,
    totalBlocks: total,
    subBlocksPerBlock: subs,
    blockStartMinute: blockStart,
    blockLabel: formatMin(blockStart),
    minutesInSubBlock: minutesInSub,
  };
}

export function subBlockProgress(date: Date, config: BlockConfig): number {
  const state = dateToBlock(date, config);
  const elapsed = state.minutesInSubBlock * 60 + date.getSeconds();
  const total = config.subBlockMinutes * 60;
  return Math.min(100, Math.max(0, (elapsed / total) * 100));
}

export interface DayBlock {
  block: number;
  totalBlocks: number;
  blockLabel: string;
  blockStartMinute: number;
  subBlocks: { subBlock: number; label: string; startMinute: number }[];
}

export function generateDayBlocks(config: BlockConfig): DayBlock[] {
  const total = totalBlocks(config.blockMinutes);
  const subs = subBlocksPerBlock(config);
  const blocks: DayBlock[] = [];
  for (let i = 0; i < total; i++) {
    const blockStart = i * config.blockMinutes;
    const subBlockList = [];
    for (let j = 0; j < subs; j++) {
      const subStart = blockStart + j * config.subBlockMinutes;
      if (subStart >= MINUTES_IN_DAY) break;
      subBlockList.push({ subBlock: j + 1, label: formatMin(subStart), startMinute: subStart });
    }
    blocks.push({
      block: i + 1,
      totalBlocks: total,
      blockLabel: formatMin(blockStart),
      blockStartMinute: blockStart,
      subBlocks: subBlockList,
    });
  }
  return blocks;
}
