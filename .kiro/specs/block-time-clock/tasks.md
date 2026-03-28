# Implementation Plan: Block Time Clock

## Overview

Implement a React-based block time clock that displays the current time in 15-minute blocks. The approach starts with the pure time-formatting logic layer, then builds hooks for state management, followed by UI components, and finishes by wiring everything together in the App shell. TypeScript throughout, MUI for styling, Vitest + fast-check for testing.

## Tasks

- [x] 1. Set up project structure and core types
  - [x] 1.1 Create the `src/lib/timeFormatter.ts` file with the `BlockRepresentation` interface, `TimeFormat` type, and all exported function signatures (stubs returning placeholder values)
    - Define `BlockRepresentation`, `TimeFormat`, `dateToBlock`, `formatBlockLabel`, `blockProgress`, `parseBlockLabel`, `minuteToBlockNumber`, `blockNumberToStartMinute`, `generateDayBlocks`
    - _Requirements: 1.1, 1.2, 1.3_

- [x] 2. Implement core time-formatting logic
  - [x] 2.1 Implement `minuteToBlockNumber` and `blockNumberToStartMinute`
    - Map minute ranges 0–14 → 1, 15–29 → 2, 30–44 → 3, 45–59 → 4
    - Inverse: block number → start minute via `(blockNumber - 1) * 15`
    - _Requirements: 1.1_

  - [x] 2.2 Implement `formatBlockLabel` and `parseBlockLabel`
    - `formatBlockLabel`: produce "H:MM" in 24h or "H:MM AM/PM" in 12h
    - `parseBlockLabel`: parse a label string back to a Date with matching hour and block
    - _Requirements: 1.3, 1.4, 5.2, 5.3_

  - [x] 2.3 Implement `dateToBlock`
    - Extract hour and minute from Date, compute blockNumber and blockStartMinute, call `formatBlockLabel` for the label
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 2.4 Implement `blockProgress`
    - Calculate `((minute % 15) * 60 + seconds) / 900 * 100`
    - Clamp result to [0, 100]
    - _Requirements: 3.1_

  - [x] 2.5 Implement `generateDayBlocks`
    - Iterate hours 0–23, blocks 1–4, produce 96 `BlockRepresentation` items
    - _Requirements: 4.1_

  - [x] 2.6 Write property test: Block mapping invariant (Property 1)
    - **Property 1: Block mapping invariant**
    - For any valid Date, `dateToBlock` returns hour in [0,23], blockNumber in [1,4], blockStartMinute in {0,15,30,45}, and blockStartMinute === (blockNumber-1)*15
    - **Validates: Requirements 1.1, 1.2**

  - [x] 2.7 Write property test: Block label format (Property 2)
    - **Property 2: Block label format**
    - For any valid Date and TimeFormat, the blockLabel minute portion is exactly "00", "15", "30", or "45"
    - **Validates: Requirements 1.3**

  - [x] 2.8 Write property test: Block format-parse round-trip (Property 3)
    - **Property 3: Block format-parse round-trip**
    - Formatting a Date via `dateToBlock` then parsing the label via `parseBlockLabel` produces a Date in the same block
    - **Validates: Requirements 1.4**

  - [x] 2.9 Write property test: Progress within valid range (Property 4)
    - **Property 4: Progress within valid range**
    - For any valid Date, `blockProgress` returns a value in [0, 100] matching the formula
    - **Validates: Requirements 3.1**

  - [x] 2.10 Write property test: Day overview completeness (Property 5)
    - **Property 5: Day overview completeness**
    - `generateDayBlocks` returns exactly 96 items covering all hour/block combinations with no duplicates
    - **Validates: Requirements 4.1**

  - [x] 2.11 Write property test: Format-specific label rules (Property 7)
    - **Property 7: Format-specific label rules**
    - 24h labels have hour in [0,23] with no AM/PM; 12h labels have hour in [1,12] with exactly one AM/PM
    - **Validates: Requirements 5.2, 5.3**

- [x] 3. Checkpoint - Core logic verification
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Implement React hooks
  - [x] 4.1 Implement `useFormatPreference` hook in `src/hooks/useFormatPreference.ts`
    - Read from `localStorage` key `"blockTimeClock.format"`, default to `'12h'`
    - Wrap reads/writes in try/catch, validate stored value is `'12h'` or `'24h'`
    - Return `[format, setFormat]` tuple
    - _Requirements: 5.1, 5.4, 5.5, 8.2_

  - [x] 4.2 Write property test: Format preference persistence round-trip (Property 8)
    - **Property 8: Format preference persistence round-trip**
    - Saving a TimeFormat to localStorage and reading it back returns the same value
    - **Validates: Requirements 5.4, 5.5**

  - [x] 4.3 Write unit tests for `useFormatPreference`
    - Test default value when localStorage is empty, persistence on change, fallback on invalid data, fallback when localStorage throws
    - _Requirements: 5.1, 5.4, 5.5, 8.2_

  - [x] 4.4 Implement `useBlockTime` hook in `src/hooks/useBlockTime.ts`
    - Set up a 1-second interval to compute current block and progress via `dateToBlock` and `blockProgress`
    - Return `{ currentBlock, progress, currentDate }`
    - Clean up interval on unmount
    - _Requirements: 2.1, 2.2, 3.1, 3.2, 3.3_

  - [x] 4.5 Write unit tests for `useBlockTime`
    - Test that hook returns valid BlockTimeState, updates on block boundary, cleans up interval
    - _Requirements: 2.1, 2.2_

- [x] 5. Checkpoint - Hooks verification
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Implement UI components
  - [x] 6.1 Create `ProgressIndicator` component in `src/components/ProgressIndicator.tsx`
    - Wrap MUI `LinearProgress` in determinate mode
    - Accept `progress` prop (0–100)
    - Include `aria-label` and `aria-valuenow` attributes
    - _Requirements: 3.1, 7.3_

  - [x] 6.2 Create `ClockDisplay` component in `src/components/ClockDisplay.tsx`
    - Render block label prominently, "Block X of 4" text, and current hour
    - Include `ProgressIndicator`
    - Use `aria-live="polite"` region for block change announcements
    - _Requirements: 2.3, 3.1, 3.2, 7.1_

  - [x] 6.3 Create `DayOverview` component in `src/components/DayOverview.tsx`
    - Render a grid of 96 cells using `generateDayBlocks`
    - Accept `currentBlock` to style past/current/future blocks distinctly
    - Add accessible labels per cell (e.g., "Block 2 of hour 14, past")
    - Use MUI `Box`/`Grid` with responsive breakpoints
    - _Requirements: 4.1, 4.2, 4.3, 7.3_

  - [x] 6.4 Write property test: Block temporal classification consistency (Property 6)
    - **Property 6: Block temporal classification consistency**
    - For any current Date, blocks before current are "past", the matching block is "current", and blocks after are "future"
    - Implement a `classifyBlock` helper function if needed and test it
    - **Validates: Requirements 4.2**

  - [x] 6.5 Create `FormatToggle` component in `src/components/FormatToggle.tsx`
    - MUI `ToggleButtonGroup` with "12h" and "24h" options
    - Accept current format and onChange callback as props
    - _Requirements: 5.1, 5.2, 5.3_

  - [x] 6.6 Write component rendering tests
    - Test ClockDisplay renders aria-live region and block info
    - Test ProgressIndicator has correct aria attributes
    - Test DayOverview renders 96 cells with correct styling
    - _Requirements: 7.1, 7.3_

- [x] 7. Checkpoint - Components verification
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Wire everything together in App shell
  - [x] 8.1 Create `src/App.tsx`
    - Compose `useFormatPreference`, `useBlockTime`, and all components
    - Wrap in MUI `ThemeProvider` and `CssBaseline`
    - Ensure sufficient color contrast (4.5:1 minimum)
    - _Requirements: 2.1, 5.1, 6.1, 7.2_

  - [x] 8.2 Create `src/main.tsx` entry point
    - Render `App` into the DOM root
    - Wrap with a React error boundary that shows fallback UI on unexpected errors
    - _Requirements: 8.1, 8.2_

  - [x] 8.3 Implement responsive layout
    - Below 600px: compact vertical stacking
    - 600px and above: horizontal arrangement
    - Ensure usability from 320px to 1920px
    - _Requirements: 6.1, 6.2, 6.3_

- [x] 9. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property tests use `fast-check` with Vitest
- Checkpoints ensure incremental validation
- Core logic is fully separated from UI for testability
