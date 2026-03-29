import type { HexTime } from './timeFormatter';

export interface ArcPath {
  d: string;        // SVG path d attribute
  startAngle: number;
  endAngle: number;
}

/**
 * Convert degrees to radians.
 */
function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Generate an SVG arc path `d` string given center, radius, and angles (in degrees).
 *
 * Returns empty string when sweep is effectively zero.
 * Handles near-360° arcs by splitting into two semicircles.
 */
export function describeArc(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number,
): string {
  const sweep = endAngle - startAngle;

  // Zero or negligible sweep — nothing to draw
  if (Math.abs(sweep) < 0.001) {
    return '';
  }

  // Near-full-circle (≥ 359.99°): draw two semicircles to avoid SVG arc ambiguity
  if (Math.abs(sweep) >= 359.99) {
    const midAngle = startAngle + 180;
    const startRad = toRadians(startAngle);
    const midRad = toRadians(midAngle);
    const endRad = toRadians(startAngle + 359.99);

    const x1 = cx + radius * Math.cos(startRad);
    const y1 = cy + radius * Math.sin(startRad);
    const xMid = cx + radius * Math.cos(midRad);
    const yMid = cy + radius * Math.sin(midRad);
    const x2 = cx + radius * Math.cos(endRad);
    const y2 = cy + radius * Math.sin(endRad);

    return [
      `M ${x1} ${y1}`,
      `A ${radius} ${radius} 0 1 1 ${xMid} ${yMid}`,
      `A ${radius} ${radius} 0 1 1 ${x2} ${y2}`,
    ].join(' ');
  }

  const startRad = toRadians(startAngle);
  const endRad = toRadians(endAngle);

  const x1 = cx + radius * Math.cos(startRad);
  const y1 = cy + radius * Math.sin(startRad);
  const x2 = cx + radius * Math.cos(endRad);
  const y2 = cy + radius * Math.sin(endRad);

  const largeArcFlag = Math.abs(sweep) > 180 ? 1 : 0;
  const sweepFlag = sweep > 0 ? 1 : 0;

  return [
    `M ${x1} ${y1}`,
    `A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${x2} ${y2}`,
  ].join(' ');
}

/**
 * Convert HexTime values to three arc paths for block, sub-block, and tick.
 * All arcs start at 12 o'clock (-90°).
 */
export function hexTimeToArcs(
  current: HexTime,
  cx: number,
  cy: number,
  radii: { block: number; sub: number; tick: number },
): { block: ArcPath; sub: ArcPath; tick: ArcPath } {
  const START_ANGLE = -90; // 12 o'clock position

  // Block and sub show their exact digit value (snap to position).
  // Only the tick ring interpolates smoothly via tickProgress.
  const blockSweep = (current.block / 16) * 360;
  const subSweep = (current.sub / 16) * 360;
  const tickSweep = ((current.tick + current.tickProgress / 100) / 16) * 360;

  return {
    block: {
      d: describeArc(cx, cy, radii.block, START_ANGLE, START_ANGLE + blockSweep),
      startAngle: START_ANGLE,
      endAngle: START_ANGLE + blockSweep,
    },
    sub: {
      d: describeArc(cx, cy, radii.sub, START_ANGLE, START_ANGLE + subSweep),
      startAngle: START_ANGLE,
      endAngle: START_ANGLE + subSweep,
    },
    tick: {
      d: describeArc(cx, cy, radii.tick, START_ANGLE, START_ANGLE + tickSweep),
      startAngle: START_ANGLE,
      endAngle: START_ANGLE + tickSweep,
    },
  };
}
