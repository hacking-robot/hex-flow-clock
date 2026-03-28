import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { dateToBlock, parseBlockLabel, blockProgress, generateDayBlocks } from '../timeFormatter';
import type { TimeFormat } from '../timeFormatter';

// Feature: block-time-clock, Property 1: Block mapping invariant
describe('Property 1: Block mapping invariant', () => {
  it('dateToBlock returns valid hour, blockNumber, blockStartMinute, and correct block mapping for any Date', () => {
    fc.assert(
      fc.property(
        fc.date(),
        fc.constantFrom<TimeFormat>('12h', '24h'),
        (date, format) => {
          const result = dateToBlock(date, format);

          // hour in [0, 23]
          expect(result.hour).toBeGreaterThanOrEqual(0);
          expect(result.hour).toBeLessThanOrEqual(23);

          // blockNumber in [1, 4]
          expect(result.blockNumber).toBeGreaterThanOrEqual(1);
          expect(result.blockNumber).toBeLessThanOrEqual(4);

          // blockStartMinute in {0, 15, 30, 45}
          expect([0, 15, 30, 45]).toContain(result.blockStartMinute);

          // blockStartMinute === (blockNumber - 1) * 15
          expect(result.blockStartMinute).toBe((result.blockNumber - 1) * 15);

          // blockNumber corresponds to the minute of the input Date
          const minute = date.getMinutes();
          const expectedBlock = Math.floor(minute / 15) + 1;
          expect(result.blockNumber).toBe(expectedBlock);
        },
      ),
      { numRuns: 100 },
    );
  });
});

// Feature: block-time-clock, Property 2: Block label format
describe('Property 2: Block label format', () => {
  // **Validates: Requirements 1.3**
  it('blockLabel minute portion is exactly "00", "15", "30", or "45" and matches blockStartMinute', () => {
    fc.assert(
      fc.property(
        fc.date(),
        fc.constantFrom<TimeFormat>('12h', '24h'),
        (date, format) => {
          const result = dateToBlock(date, format);

          // Extract the minute portion from the blockLabel
          const minuteMatch = result.blockLabel.match(/:(\d{2})/);
          expect(minuteMatch).not.toBeNull();

          const minutePortion = minuteMatch![1];

          // Minute portion must be one of "00", "15", "30", "45"
          expect(['00', '15', '30', '45']).toContain(minutePortion);

          // Minute portion must match blockStartMinute
          expect(parseInt(minutePortion, 10)).toBe(result.blockStartMinute);
        },
      ),
      { numRuns: 100 },
    );
  });
});

// Feature: block-time-clock, Property 3: Block format-parse round-trip
describe('Property 3: Block format-parse round-trip', () => {
  // **Validates: Requirements 1.4**
  it('formatting a Date via dateToBlock then parsing the label via parseBlockLabel produces a Date in the same block', () => {
    fc.assert(
      fc.property(
        fc.date(),
        fc.constantFrom<TimeFormat>('12h', '24h'),
        (date, format) => {
          const original = dateToBlock(date, format);
          const parsed = parseBlockLabel(original.blockLabel, format);
          const roundTripped = dateToBlock(parsed, format);

          expect(roundTripped.hour).toBe(original.hour);
          expect(roundTripped.blockNumber).toBe(original.blockNumber);
        },
      ),
      { numRuns: 100 },
    );
  });
});

// Feature: block-time-clock, Property 4: Progress within valid range
describe('Property 4: Progress within valid range', () => {
  // **Validates: Requirements 3.1**
  it('blockProgress returns a value in [0, 100] matching the expected formula for any Date', () => {
    fc.assert(
      fc.property(
        fc.date(),
        (date) => {
          const progress = blockProgress(date);

          // Progress must be in [0, 100]
          expect(progress).toBeGreaterThanOrEqual(0);
          expect(progress).toBeLessThanOrEqual(100);

          // Progress must equal the formula
          const minute = date.getMinutes();
          const seconds = date.getSeconds();
          const expected = ((minute % 15) * 60 + seconds) / 900 * 100;
          expect(progress).toBeCloseTo(expected, 10);
        },
      ),
      { numRuns: 100 },
    );
  });
});

// Feature: block-time-clock, Property 5: Day overview completeness
describe('Property 5: Day overview completeness', () => {
  // **Validates: Requirements 4.1**
  it('generateDayBlocks returns exactly 96 items covering all hour/block combinations with no duplicates', () => {
    fc.assert(
      fc.property(
        fc.constantFrom<TimeFormat>('12h', '24h'),
        (format) => {
          const blocks = generateDayBlocks(format);

          // Exactly 96 items
          expect(blocks).toHaveLength(96);

          // All combinations of hours 0-23 and block numbers 1-4 are present
          const seen = new Set<string>();
          for (const block of blocks) {
            const key = `${block.hour}:${block.blockNumber}`;
            // No duplicate hour/blockNumber pairs
            expect(seen.has(key)).toBe(false);
            seen.add(key);
          }

          // Verify all 96 combinations exist
          for (let hour = 0; hour <= 23; hour++) {
            for (let blockNumber = 1; blockNumber <= 4; blockNumber++) {
              expect(seen.has(`${hour}:${blockNumber}`)).toBe(true);
            }
          }
        },
      ),
      { numRuns: 100 },
    );
  });
});

// Feature: block-time-clock, Property 7: Format-specific label rules
describe('Property 7: Format-specific label rules', () => {
  // **Validates: Requirements 5.2, 5.3**
  it('24h labels have hour in [0,23] with no AM/PM', () => {
    fc.assert(
      fc.property(
        fc.date(),
        (date) => {
          const result = dateToBlock(date, '24h');
          const label = result.blockLabel;

          // Extract the hour portion (everything before the colon)
          const hourStr = label.split(':')[0];
          const hour = parseInt(hourStr, 10);

          // Hour must be in [0, 23]
          expect(hour).toBeGreaterThanOrEqual(0);
          expect(hour).toBeLessThanOrEqual(23);

          // Label must NOT contain AM or PM
          expect(label.toUpperCase()).not.toContain('AM');
          expect(label.toUpperCase()).not.toContain('PM');
        },
      ),
      { numRuns: 100 },
    );
  });

  it('12h labels have hour in [1,12] with exactly one AM/PM', () => {
    fc.assert(
      fc.property(
        fc.date(),
        (date) => {
          const result = dateToBlock(date, '12h');
          const label = result.blockLabel;

          // Extract the hour portion (everything before the colon)
          const hourStr = label.split(':')[0];
          const hour = parseInt(hourStr, 10);

          // Hour must be in [1, 12]
          expect(hour).toBeGreaterThanOrEqual(1);
          expect(hour).toBeLessThanOrEqual(12);

          // Label must contain exactly one of AM or PM
          const amCount = (label.toUpperCase().match(/AM/g) || []).length;
          const pmCount = (label.toUpperCase().match(/PM/g) || []).length;
          expect(amCount + pmCount).toBe(1);
        },
      ),
      { numRuns: 100 },
    );
  });
});

import { classifyBlock } from '../../components/DayOverview';

// Feature: block-time-clock, Property 6: Block temporal classification consistency
describe('Property 6: Block temporal classification consistency', () => {
  // **Validates: Requirements 4.2**
  it('for any current Date, blocks before current are "past", the matching block is "current", and blocks after are "future"', () => {
    fc.assert(
      fc.property(
        fc.date(),
        fc.constantFrom<TimeFormat>('12h', '24h'),
        (date, format) => {
          const currentBlock = dateToBlock(date, format);
          const allBlocks = generateDayBlocks(format);

          let currentCount = 0;

          for (const block of allBlocks) {
            const classification = classifyBlock(block, currentBlock);

            if (block.hour < currentBlock.hour) {
              expect(classification).toBe('past');
            } else if (block.hour > currentBlock.hour) {
              expect(classification).toBe('future');
            } else {
              // Same hour — compare block numbers
              if (block.blockNumber < currentBlock.blockNumber) {
                expect(classification).toBe('past');
              } else if (block.blockNumber > currentBlock.blockNumber) {
                expect(classification).toBe('future');
              } else {
                expect(classification).toBe('current');
                currentCount++;
              }
            }
          }

          // Exactly one block should be "current"
          expect(currentCount).toBe(1);
        },
      ),
      { numRuns: 100 },
    );
  });
});
