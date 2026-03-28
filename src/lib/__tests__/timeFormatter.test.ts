import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { dateToBlock, subBlockProgress, generateDayBlocks, totalBlocks, subBlocksPerBlock } from '../timeFormatter';
import type { BlockConfig } from '../timeFormatter';

const configArb = fc.record({
  blockMinutes: fc.constantFrom(30, 60, 90, 120),
  subBlockMinutes: fc.constantFrom(5, 10, 15, 30),
}).filter(c => c.subBlockMinutes <= c.blockMinutes);

describe('Block mapping', () => {
  it('dateToBlock returns valid block and subBlock', () => {
    fc.assert(
      fc.property(fc.date(), configArb, (date, config) => {
        const r = dateToBlock(date, config);
        expect(r.block).toBeGreaterThanOrEqual(1);
        expect(r.block).toBeLessThanOrEqual(r.totalBlocks);
        expect(r.subBlock).toBeGreaterThanOrEqual(1);
        expect(r.subBlock).toBeLessThanOrEqual(r.subBlocksPerBlock);
        expect(r.minutesInSubBlock).toBeGreaterThanOrEqual(0);
        expect(r.minutesInSubBlock).toBeLessThan(config.subBlockMinutes);
      }),
      { numRuns: 200 },
    );
  });
});

describe('Sub-block progress', () => {
  it('returns [0, 100]', () => {
    fc.assert(
      fc.property(fc.date(), configArb, (date, config) => {
        const p = subBlockProgress(date, config);
        expect(p).toBeGreaterThanOrEqual(0);
        expect(p).toBeLessThanOrEqual(100);
      }),
      { numRuns: 200 },
    );
  });
});

describe('Day blocks', () => {
  it('generates correct total with sub-blocks', () => {
    fc.assert(
      fc.property(configArb, (config) => {
        const blocks = generateDayBlocks(config);
        expect(blocks).toHaveLength(totalBlocks(config.blockMinutes));
        for (const b of blocks) {
          expect(b.subBlocks.length).toBeGreaterThanOrEqual(1);
          expect(b.subBlocks.length).toBeLessThanOrEqual(subBlocksPerBlock(config));
        }
      }),
      { numRuns: 200 },
    );
  });
});
