# Implementation Plan: Clock View Toggle

## Overview

Add a circular analog-style clock view and a toggle control to switch between the existing numerical display and the new circular display. Implementation proceeds bottom-up: arc utilities first, then the circular display component, then the toggle, then wiring into App.tsx.

## Tasks

- [x] 1. Create arc calculation utility
  - [x] 1.1 Create `src/lib/arcUtils.ts` with `describeArc` and `hexTimeToArcs` functions
    - Implement `describeArc(cx, cy, radius, startAngle, endAngle)` returning an SVG path `d` string
    - Handle zero-sweep (return empty string) and near-360° arcs (large-arc-flag)
    - Implement `hexTimeToArcs(current, cx, cy, radii)` converting HexTime to three arc paths
    - Block sweep = `(block / 16) * 360`, Sub sweep = `(sub / 16) * 360`, Tick sweep = `((tick + tickProgress / 100) / 16) * 360`
    - All arcs start at 12 o'clock (-90°)
    - _Requirements: 2.2, 2.3, 2.4, 3.1_

  - [x] 1.2 Write property test for arc sweep angles (Property 2)
    - **Property 2: Arc sweep angles match hex time values**
    - Create `src/lib/__tests__/arcUtils.test.ts`
    - Generate random valid HexTime objects (block/sub/tick 0–15, tickProgress 0–100) with fast-check
    - Verify block, sub, and tick sweep angles match the design formulas
    - **Validates: Requirements 2.2, 2.3, 2.4, 3.1**

- [x] 2. Implement CircularClockDisplay component
  - [x] 2.1 Create `src/components/CircularClockDisplay.tsx`
    - Render an SVG with three concentric arc paths (block outer, sub middle, tick inner) using `hexTimeToArcs`
    - Render centered `<text>` element showing `current.hex`
    - Apply purple-to-cyan gradient via SVG `<linearGradient>` definitions
    - Add CSS transition on the tick arc for smooth animation consistent with 100ms update interval
    - Responsive sizing: ~280px diameter on viewports <600px, ~360px on desktop (use MUI `useMediaQuery`)
    - Add `aria-label` on SVG element with current hex time and formatted local time
    - Add visually hidden `aria-live="polite"` region for screen reader announcements
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 3.1, 3.2, 4.1, 4.2, 4.3, 5.1, 5.2_

  - [x] 2.2 Write property test for center text (Property 3)
    - **Property 3: Center text matches hex string**
    - Create `src/components/__tests__/CircularClockDisplay.test.tsx`
    - Generate random valid HexTime objects, render CircularClockDisplay, verify SVG text content equals `current.hex`
    - **Validates: Requirements 2.5**

  - [x] 2.3 Write property test for accessible label (Property 4)
    - **Property 4: Accessible label contains hex time and local time**
    - Generate random HexTime + Date pairs, render CircularClockDisplay, verify aria-label contains both hex time string and formatted local time
    - **Validates: Requirements 5.1**

- [x] 3. Implement ViewToggle component
  - [x] 3.1 Create `src/components/ViewToggle.tsx`
    - Accept `activeView: 'numerical' | 'circular'` and `onToggle: () => void` props
    - Render a segmented control or icon button pair indicating numerical vs circular
    - Visually highlight the active view
    - Handle click, Enter, and Space key events to call `onToggle`
    - Dynamic `aria-label` describing the action (e.g., "Switch to circular view" when numerical is active)
    - _Requirements: 1.1, 1.2, 1.3, 1.5, 5.3_

  - [x] 3.2 Write property test for toggle alternation (Property 1)
    - **Property 1: Toggle alternation**
    - Create `src/components/__tests__/ViewToggle.test.tsx`
    - Generate random non-negative integers N, simulate N toggles from default state, verify view is `'numerical'` when N is even and `'circular'` when N is odd
    - **Validates: Requirements 1.2**

  - [x] 3.3 Write property test for toggle accessible name (Property 5)
    - **Property 5: Toggle accessible name reflects current state**
    - Generate random view states, render ViewToggle, verify accessible name references switching to the opposite view
    - **Validates: Requirements 5.3**

- [x] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Wire components into App.tsx
  - [x] 5.1 Add view state and conditional rendering in `src/App.tsx`
    - Add `activeView` state: `useState<'numerical' | 'circular'>('numerical')`
    - Define `ClockViewMode` type in App or a shared types location
    - Import and render `ViewToggle` above the clock display area
    - Conditionally render `ClockDisplay` or `CircularClockDisplay` based on `activeView`
    - Ensure `useHexTime` hook continues running regardless of active view (already the case — just verify no conditional hook calls)
    - _Requirements: 1.1, 1.2, 1.4, 6.1, 6.2, 6.3_

  - [x] 5.2 Write unit tests for view integration
    - Test that App defaults to numerical view on initial load
    - Test that toggling switches the rendered component
    - Test that time data is current after switching views (no stale data)
    - _Requirements: 1.4, 6.1, 6.2, 6.3_

- [x] 6. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- The existing `useHexTime` hook and `ClockDisplay` component require no modifications
