import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { dateToHex, hexToSeconds, formatTime, generateBlocks } from '../timeFormatter';

describe('dateToHex', () => {
  it('returns block, sub, tick in [0,15] for any Date', () => {
    fc.assert(
      fc.property(fc.date(), (date) => {
        const r = dateToHex(date);
        expect(r.block).toBeGreaterThanOrEqual(0);
        expect(r.block).toBeLessThanOrEqual(15);
        expect(r.sub).toBeGreaterThanOrEqual(0);
        expect(r.sub).toBeLessThanOrEqual(15);
        expect(r.tick).toBeGreaterThanOrEqual(0);
        expect(r.tick).toBeLessThanOrEqual(15);
        expect(r.hex).toHaveLength(3);
        expect(r.tickProgress).toBeGreaterThanOrEqual(0);
        expect(r.tickProgress).toBeLessThanOrEqual(100);
      }),
      { numRuns: 500 },
    );
  });

  it('hex string matches block/sub/tick values', () => {
    fc.assert(
      fc.property(fc.date(), (date) => {
        const r = dateToHex(date);
        const HEX = '0123456789ABCDEF';
        expect(r.hex[0]).toBe(HEX[r.block]);
        expect(r.hex[1]).toBe(HEX[r.sub]);
        expect(r.hex[2]).toBe(HEX[r.tick]);
      }),
      { numRuns: 200 },
    );
  });
});

describe('hexToSeconds round-trip', () => {
  it('dateToHex then hexToSeconds lands in the same tick', () => {
    fc.assert(
      fc.property(fc.date(), (date) => {
        const hex = dateToHex(date);
        const sec = hexToSeconds(hex.hex);
        expect(sec).not.toBeNull();
        // The returned seconds should be the start of that tick
        const localSec = date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
        // sec should be <= localSec and within one tick (~21s)
        expect(sec!).toBeLessThanOrEqual(localSec + 1);
        expect(localSec - sec!).toBeLessThan(22);
      }),
      { numRuns: 200 },
    );
  });
});

describe('generateBlocks', () => {
  it('returns 16 blocks', () => {
    expect(generateBlocks()).toHaveLength(16);
  });
});
