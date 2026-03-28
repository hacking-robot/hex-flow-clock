/**
 * Core time-formatting logic for the Block Time Clock.
 *
 * Block duration and day start time are configurable.
 * Pure functions with no side effects.
 */

const MINUTES_IN_DAY = 1440;

export interface BlockRepresentation {
  globalBlock: number;
  totalBlocks: number;
  /** 24h label for block start, e.g. "13:30" */
  blockLabel: string;
  /** Absolute start minute of the day (0–1439) */
  blockStartMinute: number;
}

export interface BlockConfig {
  blockMinutes: number;
  /** Minute of day when block 1 starts (0–1439). Default 0. */
  startMinute: number;
}

function formatMinute(minuteOfDay: number): string {
  const wrapped = ((minuteOfDay % MINUTES_IN_DAY) + MINUTES_IN_DAY) % MINUTES_IN_DAY;
  const h = Math.floor(wrapped / 60);
  const m = wrapped % 60;
  return `${h}:${m.toString().padStart(2, '0')}`;
}

export function totalBlocks(blockMinutes: number): number {
  return Math.ceil(MINUTES_IN_DAY / blockMinutes);
}

export function dateToBlock(date: Date, config: BlockConfig): BlockRepresentation {
  const minuteOfDay = date.getHours() * 60 + date.getMinutes();
  const offset = ((minuteOfDay - config.startMinute) % MINUTES_IN_DAY + MINUTES_IN_DAY) % MINUTES_IN_DAY;
  const total = totalBlocks(config.blockMinutes);
  const globalBlock = Math.min(Math.floor(offset / config.blockMinutes) + 1, total);
  const absStart = (config.startMinute + (globalBlock - 1) * config.blockMinutes) % MINUTES_IN_DAY;
  return {
    globalBlock,
    totalBlocks: total,
    blockLabel: formatMinute(absStart),
    blockStartMinute: absStart,
  };
}

export function blockProgress(date: Date, config: BlockConfig): number {
  const minuteOfDay = date.getHours() * 60 + date.getMinutes();
  const seconds = date.getSeconds();
  const offset = ((minuteOfDay - config.startMinute) % MINUTES_IN_DAY + MINUTES_IN_DAY) % MINUTES_IN_DAY;
  const elapsed = (offset % config.blockMinutes) * 60 + seconds;
  const blockSeconds = config.blockMinutes * 60;
  return Math.min(100, Math.max(0, (elapsed / blockSeconds) * 100));
}

export function generateDayBlocks(config: BlockConfig): BlockRepresentation[] {
  const total = totalBlocks(config.blockMinutes);
  const blocks: BlockRepresentation[] = [];
  for (let i = 0; i < total; i++) {
    const absStart = (config.startMinute + i * config.blockMinutes) % MINUTES_IN_DAY;
    blocks.push({
      globalBlock: i + 1,
      totalBlocks: total,
      blockLabel: formatMinute(absStart),
      blockStartMinute: absStart,
    });
  }
  return blocks;
}
