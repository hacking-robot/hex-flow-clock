import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { dateToBlock, blockProgress, generateDayBlocks, totalBlocks } from '../timeFormatter';
import type { BlockConfig } from '../timeFormatter';

const blockMinutesArb = fc.constantFrom(15, 30, 45, 60, 90, 120, 180, 240);
const startMinuteArb = fc.integer({ min: 0, max: 1439 });
const configArb = fc.record({ blockMinutes: blockMinutesArb, startMinute: startMinuteArb });

describe('Property 1: Block mapping invariant', () => {
  it('dateToBlock returns globalBlock in [1, totalBlocks]', () => {
    fc.assert(
      fc.property(fc.date(), configArb, (date, config) => {
        const r = dateToBlock(date, config);
        const total = totalBlocks(config.blockMinutes);
        expect(r.globalBlock).toBeGreaterThanOrEqual(1);
        expect(r.globalBlock).toBeLessThanOrEqual(total);
        expect(r.totalBlocks).toBe(total);
      }),
      { numRuns: 200 },
    );
  });
});

describe('Property 4: Progress within valid range', () => {
  it('blockProgress returns [0, 100]', () => {
    fc.assert(
      fc.property(fc.date(), configArb, (date, config) => {
        const p = blockProgress(date, config);
        expect(p).toBeGreaterThanOrEqual(0);
        expect(p).toBeLessThanOrEqual(100);
      }),
      { numRuns: 200 },
    );
  });
});

describe('Property 5: Day overview completeness', () => {
  it('generateDayBlocks returns totalBlocks items with sequential globalBlock', () => {
    fc.assert(
      fc.property(configArb, (config) => {
        const blocks = generateDayBlocks(config);
        const total = totalBlocks(config.blockMinutes);
        expect(blocks).toHaveLength(total);
        blocks.forEach((b, i) => expect(b.globalBlock).toBe(i + 1));
      }),
      { numRuns: 200 },
    );
  });
});
