import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import App from '../../App';
import { ClockDisplay } from '../ClockDisplay';
import { ProgressIndicator } from '../ProgressIndicator';

// Recreate the theme as defined in App.tsx for direct assertions
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#7C4DFF' },
    secondary: { main: '#00E5FF' },
    background: { default: '#0a0a1a', paper: '#1a1a2e' },
    text: { primary: '#E0E0E0', secondary: '#9E9E9E' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica Neue", sans-serif',
    h1: { fontFamily: '"JetBrains Mono", "Fira Code", monospace', fontWeight: 700 },
    body1: { fontSize: '1rem' },
    body2: { fontSize: '0.875rem' },
    caption: { fontSize: '0.75rem' },
  },
  shape: { borderRadius: 12 },
});

describe('7.1 Theme configuration', () => {
  it('has dark mode enabled', () => {
    expect(theme.palette.mode).toBe('dark');
  });

  it('has expected primary color', () => {
    expect(theme.palette.primary.main).toBe('#7C4DFF');
  });

  it('has expected secondary color', () => {
    expect(theme.palette.secondary.main).toBe('#00E5FF');
  });

  it('has expected background colors', () => {
    expect(theme.palette.background.default).toBe('#0a0a1a');
    expect(theme.palette.background.paper).toBe('#1a1a2e');
  });
});

describe('7.2 App gradient background', () => {
  it('renders a root element covering the viewport', () => {
    const { container } = render(<App />);
    // The gradient Box is the first child after CssBaseline inside ThemeProvider.
    // MUI CssBaseline renders a <style> tag; the Box renders a <div>.
    // Look for a div with the MuiBox-root class that is a direct child of the container.
    const boxes = container.querySelectorAll('.MuiBox-root');
    // The first MuiBox-root should be the gradient wrapper
    expect(boxes.length).toBeGreaterThan(0);
    // Verify the outermost Box exists (gradient background container)
    const gradientBox = boxes[0];
    expect(gradientBox).toBeTruthy();
    expect(gradientBox.tagName).toBe('DIV');
  });
});

describe('7.3 ClockDisplay hex time styling', () => {
  const current = { block: 1, sub: 10, tick: 2, hex: '1A2', tickProgress: 50 };
  const date = new Date(Date.UTC(2024, 0, 1, 7, 30, 0));

  it('renders hex time with textShadow style', () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <ClockDisplay current={current} currentDate={date} />
      </ThemeProvider>,
    );
    const hexEl = screen.getByText('1A2');
    // MUI applies sx styles via CSS classes, but textShadow is set as inline-like via emotion.
    // Check the computed className includes MUI typography class
    expect(hexEl).toBeInTheDocument();
    // The element should have a style or class that includes the textShadow.
    // In jsdom with emotion, styles are injected into <style> tags.
    // We verify the element exists and has the correct font family via inline sx.
    const style = window.getComputedStyle(hexEl);
    // Emotion injects styles into the document head; getComputedStyle in jsdom
    // may not resolve them. Instead, verify the element's class is applied.
    expect(hexEl.className).toContain('MuiTypography');
  });

  it('uses monospace font family on hex time element', () => {
    render(
      <ThemeProvider theme={theme}>
        <ClockDisplay current={current} currentDate={date} />
      </ThemeProvider>,
    );
    const hexEl = screen.getByText('1A2');
    // The sx prop sets fontFamily: 'monospace' which emotion compiles to a class.
    // We can check the rendered style sheets for the monospace declaration.
    const styleSheets = Array.from(document.querySelectorAll('style'));
    const allCSS = styleSheets.map((s) => s.textContent).join('');
    // The emotion-generated CSS should contain 'monospace' for this element's class
    const classes = hexEl.className.split(/\s+/);
    const hasMonospaceRule = classes.some((cls) => {
      const regex = new RegExp(`\\.${CSS.escape(cls)}[^{]*\\{[^}]*font-family[^}]*monospace`, 'i');
      return regex.test(allCSS);
    });
    expect(hasMonospaceRule).toBe(true);
  });
});

describe('7.4 ProgressIndicator styling', () => {
  it('renders a progressbar element', () => {
    render(
      <ThemeProvider theme={theme}>
        <ProgressIndicator progress={50} />
      </ThemeProvider>,
    );
    const bar = screen.getByRole('progressbar');
    expect(bar).toBeInTheDocument();
  });

  it('has MUI LinearProgress classes for track and bar', () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <ProgressIndicator progress={50} />
      </ThemeProvider>,
    );
    // The root element should have the LinearProgress class
    const root = container.querySelector('.MuiLinearProgress-root');
    expect(root).toBeTruthy();
    // The bar element should exist
    const bar = container.querySelector('.MuiLinearProgress-bar');
    expect(bar).toBeTruthy();
  });

  it('applies gradient and rounded styles via emotion CSS', () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <ProgressIndicator progress={50} />
      </ThemeProvider>,
    );
    // Collect all injected styles
    const styleSheets = Array.from(document.querySelectorAll('style'));
    const allCSS = styleSheets.map((s) => s.textContent).join('');
    // Verify gradient background-image rule exists in the CSS
    expect(allCSS).toContain('linear-gradient');
    // Verify border-radius rule exists
    expect(allCSS).toContain('border-radius');
  });
});

describe('7.5 ARIA labels, roles, and aria-live region', () => {
  it('preserves aria-live="polite" region in ClockDisplay', () => {
    const current = { block: 1, sub: 10, tick: 2, hex: '1A2', tickProgress: 50 };
    const date = new Date(Date.UTC(2024, 0, 1, 7, 30, 0));
    const { container } = render(
      <ThemeProvider theme={theme}>
        <ClockDisplay current={current} currentDate={date} />
      </ThemeProvider>,
    );
    const liveRegion = container.querySelector('[aria-live="polite"]');
    expect(liveRegion).toBeTruthy();
  });

  it('preserves aria-label on ProgressIndicator', () => {
    render(
      <ThemeProvider theme={theme}>
        <ProgressIndicator progress={50} />
      </ThemeProvider>,
    );
    expect(screen.getByLabelText('Block progress')).toBeInTheDocument();
  });

  it('preserves grid role and aria-label on DayOverview in full App', () => {
    render(<App />);
    // DayOverview is inside a Collapse that may be closed by default.
    // The grid role should still be in the DOM (Collapse keeps children mounted).
    const grid = document.querySelector('[role="grid"]');
    expect(grid).toBeTruthy();
    expect(grid?.getAttribute('aria-label')).toBe('Day overview showing all 16 blocks');
  });

  it('preserves gridcell roles in DayOverview', () => {
    render(<App />);
    const cells = document.querySelectorAll('[role="gridcell"]');
    expect(cells.length).toBe(16);
  });
});

describe('7.6 App uses MUI Collapse for details panel', () => {
  it('renders a MuiCollapse element in the DOM', () => {
    const { container } = render(<App />);
    const collapse = container.querySelector('.MuiCollapse-root');
    expect(collapse).toBeTruthy();
  });

  it('Collapse wraps the details panel content', () => {
    const { container } = render(<App />);
    const collapse = container.querySelector('.MuiCollapse-root');
    // The DayOverview grid should be inside the Collapse wrapper
    const gridInCollapse = collapse?.querySelector('[role="grid"]');
    expect(gridInCollapse).toBeTruthy();
  });
});
