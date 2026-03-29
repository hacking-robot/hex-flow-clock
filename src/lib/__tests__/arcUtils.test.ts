import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { hexTimeToArcs } from '../arcUtils';
import type { HexTime } from '../timeFormatter';

/**
 * Arbitrary for valid HexTime objects.
 * block, sub, tick: integers 0–15
 * tickProgress: number 0–100
 * hex: derived from the numeric values
 */
const HEX_CHARS = '0123456789ABCDEF';

const hexTimeArb: fc.Arbitrary<HexTime> = fc
  .record({
    block: fc.integer({ min: 0, max: 15 }),
    sub: fc.integer({ min: 0, max: 15 }),
    tick: fc.integer({ min: 0, max: 15 }),
    tickProgress: fc.double({ min: 0, max: 100, noNaN: true }),
  })
  .map(({ block, sub, tick, tickProgress }) => ({
    block,
    sub,
    tick,
    tickProgress,
    hex: `${HEX_CHARS[block]}${HEX_CHARS[sub]}${HEX_CHARS[tick]}`,
  }));

describe('Feature: clock-view-toggle, Property 2: Arc sweep angles match hex time values', () => {
  /**
   * **Validates: Requirements 2.2, 2.3, 2.4, 3.1**
   *
   * Block and sub snap to digit value. Tick interpolates via tickProgress:
   *   Block sweep = (block / 16) * 360
   *   Sub sweep   = (sub / 16) * 360
   *   Tick sweep  = ((tick + tickProgress/100) / 16) * 360
   */
  it('should produce sweep angles matching the design formulas for all valid HexTime inputs', () => {
    const cx = 180;
    const cy = 180;
    const radii = { block: 160, sub: 130, tick: 40 };
    const START_ANGLE = -90;

    fc.assert(
      fc.property(hexTimeArb, (hexTime) => {
        const arcs = hexTimeToArcs(hexTime, cx, cy, radii);

        const expectedBlockSweep = (hexTime.block / 16) * 360;
        const expectedSubSweep = (hexTime.sub / 16) * 360;
        const expectedTickSweep = ((hexTime.tick + hexTime.tickProgress / 100) / 16) * 360;

        const blockSweep = arcs.block.endAngle - arcs.block.startAngle;
        const subSweep = arcs.sub.endAngle - arcs.sub.startAngle;
        const tickSweep = arcs.tick.endAngle - arcs.tick.startAngle;

        expect(arcs.block.startAngle).toBe(START_ANGLE);
        expect(arcs.sub.startAngle).toBe(START_ANGLE);
        expect(arcs.tick.startAngle).toBe(START_ANGLE);

        expect(blockSweep).toBeCloseTo(expectedBlockSweep, 5);
        expect(subSweep).toBeCloseTo(expectedSubSweep, 5);
        expect(tickSweep).toBeCloseTo(expectedTickSweep, 5);
      }),
      { numRuns: 100 },
    );
  });
});
