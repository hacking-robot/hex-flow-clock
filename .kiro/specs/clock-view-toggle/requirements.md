# Requirements Document

## Introduction

The Hexflow Clock app currently displays hex time as a numerical readout (e.g. "1A2") with a linear progress indicator. This feature adds an alternate circular (analog-style) clock view and a toggle control so users can switch between the numerical display and the circular display. The circular clock visually represents hex time using concentric rings or arcs for blocks, sub-blocks, and ticks, keeping the same purple/cyan gradient aesthetic.

## Glossary

- **Clock_App**: The Hexflow Clock React application
- **Numerical_View**: The existing clock display showing hex time as large styled text with a linear progress bar
- **Circular_View**: A new analog-style clock display that represents hex time using circular arcs or rings
- **View_Toggle**: A UI control that switches the active clock view between Numerical_View and Circular_View
- **HexTime**: The data object containing block (0–15), sub-block (0–15), tick (0–15), hex string, and tickProgress values

## Requirements

### Requirement 1: View Toggle Control

**User Story:** As a user, I want a toggle control near the clock display, so that I can switch between the numerical and circular clock views.

#### Acceptance Criteria

1. THE Clock_App SHALL render a View_Toggle control in the clock display area
2. WHEN the user activates the View_Toggle, THE Clock_App SHALL switch the displayed view between Numerical_View and Circular_View
3. THE View_Toggle SHALL visually indicate which view is currently active
4. THE Clock_App SHALL default to the Numerical_View on initial load
5. THE View_Toggle SHALL be keyboard accessible and operable with Enter and Space keys

### Requirement 2: Circular Clock Display

**User Story:** As a user, I want a circular clock face that visualizes hex time, so that I can read the time in an analog-style format.

#### Acceptance Criteria

1. WHEN the Circular_View is active, THE Clock_App SHALL render a circular clock face using SVG or Canvas
2. THE Circular_View SHALL display the current block value (0–F) as a filled arc spanning the appropriate fraction of a full circle (block / 16)
3. THE Circular_View SHALL display the current sub-block value (0–F) as a second arc on a distinct ring representing the sub-block fraction (sub / 16)
4. THE Circular_View SHALL display the current tick value (0–F) as a third arc on a distinct ring representing the tick fraction (tick / 16)
5. THE Circular_View SHALL display the current hex time string (e.g. "1A2") as text centered within the circular clock face
6. THE Circular_View SHALL use the existing purple-to-cyan gradient color scheme consistent with the Numerical_View
7. THE Circular_View SHALL update in real time as the HexTime values change, matching the same update interval as the Numerical_View

### Requirement 3: Tick Progress Animation

**User Story:** As a user, I want the circular clock to animate smoothly within each tick, so that the display feels alive and continuous.

#### Acceptance Criteria

1. WHILE the Circular_View is active, THE tick arc SHALL animate smoothly using the tickProgress value (0–100) to interpolate within the current tick
2. THE Circular_View tick arc animation SHALL use a transition duration consistent with the 100ms update interval of the HexTime hook

### Requirement 4: Responsive Sizing

**User Story:** As a user, I want the circular clock to look good on both mobile and desktop screens, so that the experience is consistent across devices.

#### Acceptance Criteria

1. THE Circular_View SHALL scale its diameter responsively based on the viewport width
2. WHEN the viewport width is below 600px, THE Circular_View SHALL render at a smaller diameter than on viewports at or above 600px
3. THE Circular_View arcs and center text SHALL remain legible at all supported sizes

### Requirement 5: Accessibility

**User Story:** As a user relying on assistive technology, I want the circular clock to convey the current time, so that I can access the same information as sighted users.

#### Acceptance Criteria

1. THE Circular_View SHALL include an aria-label on the SVG or Canvas element describing the current hex time and equivalent local time
2. THE Circular_View SHALL include a visually hidden live region that announces time changes, equivalent to the existing Numerical_View live region
3. THE View_Toggle SHALL have an accessible name that describes its purpose (e.g. "Switch to circular view" or "Switch to numerical view")

### Requirement 6: State Preservation Across Toggle

**User Story:** As a user, I want the clock to keep running seamlessly when I switch views, so that I never see stale or incorrect time.

#### Acceptance Criteria

1. WHEN the user switches from Numerical_View to Circular_View, THE Clock_App SHALL display the current HexTime without delay or stale data
2. WHEN the user switches from Circular_View to Numerical_View, THE Clock_App SHALL display the current HexTime without delay or stale data
3. THE useHexTime hook SHALL continue running regardless of which view is active
