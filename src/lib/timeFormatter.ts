/**
 * Core time-formatting logic for the Block Time Clock.
 *
 * Converts standard Date objects into 15-minute block representations.
 * Pure functions with no side effects — fully testable without DOM or React.
 */

/** A block-based representation of a point in time. */
export interface BlockRepresentation {
  /** Hour in 24h format (0–23) */
  hour: number;
  /** Block within the hour (1–4) */
  blockNumber: number;
  /** Human-readable label, e.g. "2:15 PM" or "14:15" */
  blockLabel: string;
  /** Start minute of the block: 0, 15, 30, or 45 */
  blockStartMinute: number;
}

/** Display format for time labels. */
export type TimeFormat = '12h' | '24h';

/** Convert a Date to its BlockRepresentation. */
export function dateToBlock(date: Date, format: TimeFormat): BlockRepresentation {
  const hour = date.getHours();
  const minute = date.getMinutes();
  const blockNumber = minuteToBlockNumber(minute);
  const blockStartMinute = blockNumberToStartMinute(blockNumber);
  const blockLabel = formatBlockLabel(hour, blockStartMinute, format);
  return { hour, blockNumber, blockLabel, blockStartMinute };
}

/** Format a block label string given hour, block start minute, and format. */
export function formatBlockLabel(hour: number, blockStartMinute: number, format: TimeFormat): string {
  const mm = blockStartMinute.toString().padStart(2, '0');
  if (format === '24h') {
    return `${hour}:${mm}`;
  }
  const period = hour < 12 ? 'AM' : 'PM';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${mm} ${period}`;
}

/** Calculate progress (0–100) within the current 15-minute block. */
export function blockProgress(date: Date): number {
  const minute = date.getMinutes();
  const seconds = date.getSeconds();
  const raw = ((minute % 15) * 60 + seconds) / 900 * 100;
  return Math.min(100, Math.max(0, raw));
}

/** Parse a block label back to a Date (for round-trip validation). */
export function parseBlockLabel(label: string, format: TimeFormat): Date {
  const date = new Date();
  date.setSeconds(0, 0);

  if (format === '24h') {
    const [hourStr, minuteStr] = label.split(':');
    date.setHours(parseInt(hourStr, 10), parseInt(minuteStr, 10));
    return date;
  }

  // 12h format: "H:MM AM/PM"
  const match = label.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) {
    return new Date(0);
  }

  let hour = parseInt(match[1], 10);
  const minute = parseInt(match[2], 10);
  const period = match[3].toUpperCase();

  if (period === 'AM' && hour === 12) {
    hour = 0;
  } else if (period === 'PM' && hour !== 12) {
    hour += 12;
  }

  date.setHours(hour, minute);
  return date;
}

/** Get the block number (1–4) for a given minute value (0–59). */
export function minuteToBlockNumber(minute: number): number {
  return Math.floor(minute / 15) + 1;
}

/** Get the block start minute for a given block number (1–4). */
export function blockNumberToStartMinute(blockNumber: number): number {
  return (blockNumber - 1) * 15;
}

/** Generate all 96 block representations for a full 24-hour day. */
export function generateDayBlocks(format: TimeFormat): BlockRepresentation[] {
  const blocks: BlockRepresentation[] = [];
  for (let hour = 0; hour <= 23; hour++) {
    for (let blockNumber = 1; blockNumber <= 4; blockNumber++) {
      const blockStartMinute = blockNumberToStartMinute(blockNumber);
      const blockLabel = formatBlockLabel(hour, blockStartMinute, format);
      blocks.push({ hour, blockNumber, blockLabel, blockStartMinute });
    }
  }
  return blocks;
}
