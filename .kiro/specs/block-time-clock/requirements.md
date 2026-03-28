# Requirements Document

## Introduction

Block Time Clock is a web application that displays the current time of day using 15-minute blocks instead of exact minutes. The application targets users who prefer a simplified, block-based perception of time — rounding the current moment to the nearest 15-minute interval. Built with Bun, Vite, React.js, MUI, and tested with Vitest.

## Glossary

- **Block_Time_Clock**: The main web application that displays time in 15-minute blocks
- **Block**: A 15-minute interval within an hour (e.g., 0–14 min = Block 1, 15–29 min = Block 2, 30–44 min = Block 3, 45–59 min = Block 4)
- **Current_Block**: The block corresponding to the current system time
- **Clock_Display**: The visual component that renders the current time as blocks
- **Block_Label**: The human-readable label for a block (e.g., "2:00", "2:15", "2:30", "2:45")
- **Time_Formatter**: The module responsible for converting a Date into a block representation
- **Block_Representation**: A data structure containing the hour, block number (1–4), and formatted label for a given time

## Requirements

### Requirement 1: Block Time Calculation

**User Story:** As a user, I want the current time converted into 15-minute blocks, so that I can read time in a simplified block format.

#### Acceptance Criteria

1. THE Time_Formatter SHALL divide each hour into exactly 4 blocks of 15 minutes each (Block 1: minutes 0–14, Block 2: minutes 15–29, Block 3: minutes 30–44, Block 4: minutes 45–59)
2. WHEN a Date value is provided, THE Time_Formatter SHALL return a Block_Representation containing the hour (0–23), the block number (1–4), and the Block_Label
3. THE Time_Formatter SHALL format the Block_Label as "H:MM" where MM is the block start minute (00, 15, 30, or 45)
4. FOR ALL valid Date values, formatting a Date to a Block_Representation and then parsing the Block_Label back to a Date SHALL produce a Date within the same block (round-trip property)

### Requirement 2: Live Clock Display

**User Story:** As a user, I want to see the current block time displayed on screen and updated automatically, so that I always know what block of time I am in.

#### Acceptance Criteria

1. WHEN the Block_Time_Clock loads, THE Clock_Display SHALL show the Current_Block based on the user's system time
2. WHILE the Block_Time_Clock is running, THE Clock_Display SHALL update the displayed block within 1 second of a block boundary being crossed
3. THE Clock_Display SHALL display the Block_Label, the block number within the hour (e.g., "Block 2 of 4"), and the current hour

### Requirement 3: Visual Block Progress Indicator

**User Story:** As a user, I want a visual indicator showing how far through the current block I am, so that I have a sense of progression within the block without seeing exact minutes.

#### Acceptance Criteria

1. THE Clock_Display SHALL render a progress indicator representing elapsed time within the Current_Block
2. WHEN the Current_Block changes, THE Clock_Display SHALL reset the progress indicator to 0%
3. THE Clock_Display SHALL update the progress indicator at least once every 15 seconds

### Requirement 4: Day Overview in Blocks

**User Story:** As a user, I want to see an overview of the full day divided into blocks, so that I can visualize where I am in the day.

#### Acceptance Criteria

1. THE Block_Time_Clock SHALL display a day overview showing all 96 blocks in a 24-hour day (24 hours × 4 blocks)
2. THE Clock_Display SHALL visually distinguish the Current_Block from past blocks and future blocks using distinct styles
3. WHEN the Current_Block changes, THE Clock_Display SHALL update the day overview to reflect the new Current_Block

### Requirement 5: 12-Hour and 24-Hour Format Support

**User Story:** As a user, I want to toggle between 12-hour and 24-hour time format, so that I can read block time in my preferred format.

#### Acceptance Criteria

1. THE Block_Time_Clock SHALL default to the 12-hour time format
2. WHEN the user selects 24-hour format, THE Time_Formatter SHALL display hours in the range 0–23 without AM/PM
3. WHEN the user selects 12-hour format, THE Time_Formatter SHALL display hours in the range 1–12 with an AM/PM indicator
4. THE Block_Time_Clock SHALL persist the user's format preference in browser local storage
5. WHEN the Block_Time_Clock loads, THE Block_Time_Clock SHALL restore the previously saved format preference from local storage

### Requirement 6: Responsive Layout

**User Story:** As a user, I want the clock to be usable on both desktop and mobile screens, so that I can check block time from any device.

#### Acceptance Criteria

1. THE Block_Time_Clock SHALL render correctly on viewport widths from 320px to 1920px
2. WHILE the viewport width is below 600px, THE Clock_Display SHALL use a compact layout that stacks elements vertically
3. WHILE the viewport width is 600px or above, THE Clock_Display SHALL use a standard layout with elements arranged horizontally

### Requirement 7: Accessibility

**User Story:** As a user with assistive technology, I want the clock to be accessible, so that I can read block time using a screen reader.

#### Acceptance Criteria

1. THE Clock_Display SHALL provide an aria-live region that announces the Current_Block when the block changes
2. THE Clock_Display SHALL use sufficient color contrast (minimum 4.5:1 ratio) for all text elements
3. THE Clock_Display SHALL provide accessible labels for the progress indicator and day overview components

### Requirement 8: Error Handling

**User Story:** As a user, I want the clock to handle unexpected situations gracefully, so that I always see a usable display.

#### Acceptance Criteria

1. IF the system time is unavailable, THEN THE Block_Time_Clock SHALL display a message indicating that the time cannot be determined
2. IF local storage is unavailable, THEN THE Block_Time_Clock SHALL fall back to the default 12-hour format without displaying an error to the user
