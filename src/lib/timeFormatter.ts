/**
 * Hexadecimal time system.
 *
 * A day (local time) is divided into 16 blocks of 90 minutes,
 * each block into 16 sub-blocks (~5.625 min),
 * each sub-block into 16 ticks (~21.09 sec).
 *
 * Time is represented as 3 hex digits: B.S.T (e.g. "1A2")
 * where B, S, T are each 0–F.
 *
 * Uses local time so blocks align with your actual day and
 * DST is handled automatically by the browser.
 */

const SECONDS_IN_DAY = 86400;
const BLOCK_SECONDS = SECONDS_IN_DAY / 16;       // 5400
const SUB_SECONDS = BLOCK_SECONDS / 16;           // 337.5
const TICK_SECONDS = SUB_SECONDS / 16;             // 21.09375

const HEX = '0123456789ABCDEF';

export interface HexTime {
  block: number;    // 0–15
  sub: number;      // 0–15
  tick: number;     // 0–15
  hex: string;      // e.g. "1A2"
  tickProgress: number; // 0–100 within current tick
}

/** Convert a Date (uses local time) to HexTime. */
export function dateToHex(date: Date): HexTime {
  const secOfDay = date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
  const ms = date.getMilliseconds();
  const totalSec = secOfDay + ms / 1000;

  const block = Math.min(Math.floor(totalSec / BLOCK_SECONDS), 15);
  const inBlock = totalSec - block * BLOCK_SECONDS;
  const sub = Math.min(Math.floor(inBlock / SUB_SECONDS), 15);
  const inSub = inBlock - sub * SUB_SECONDS;
  const tick = Math.min(Math.floor(inSub / TICK_SECONDS), 15);
  const inTick = inSub - tick * TICK_SECONDS;
  const tickProgress = Math.min(100, (inTick / TICK_SECONDS) * 100);

  return {
    block, sub, tick,
    hex: `${HEX[block]}${HEX[sub]}${HEX[tick]}`,
    tickProgress,
  };
}

/** Convert hex string (e.g. "1A2") back to local seconds of day. */
export function hexToSeconds(hex: string): number | null {
  if (hex.length !== 3) return null;
  const b = HEX.indexOf(hex[0].toUpperCase());
  const s = HEX.indexOf(hex[1].toUpperCase());
  const t = HEX.indexOf(hex[2].toUpperCase());
  if (b < 0 || s < 0 || t < 0) return null;
  return b * BLOCK_SECONDS + s * SUB_SECONDS + t * TICK_SECONDS;
}

/** Format seconds of day as H:MM:SS. */
export function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

/** Generate all 16 blocks with their hex prefix. */
export function generateBlocks(): { block: number; hex: string; startTime: string }[] {
  return Array.from({ length: 16 }, (_, i) => ({
    block: i,
    hex: HEX[i],
    startTime: formatTime(i * BLOCK_SECONDS),
  }));
}
