import type { Stroke } from '@/schemas/invoice';

import { fitTransform, parseSignature, serializeSignature, strokesBounds, strokeToPath } from '../signature';

const strokes: Stroke[] = [
  {
  points: [
      { x: 12.5, y: 40 },
      { x: 13, y: 41 },
    ],
  },
  { points: [{ x: 100, y: 10 }] },
];

describe('signature (de)serialization', () => {
  it('produces the Swift-compatible JSON format', () => {
    expect(serializeSignature([strokes[0]])).toBe('[{"points":[{"x":12.5,"y":40},{"x":13,"y":41}]}]');
  });

  it('round trips', () => {
    expect(parseSignature(serializeSignature(strokes))).toEqual(strokes);
  });

  it('parses a Swift-encoded signature', () => {
    expect(parseSignature('[{"points":[{"x":1,"y":2}]}]')).toEqual([{ points: [{ x: 1, y: 2 }] }]);
  });

  it('returns [] for invalid input', () => {
    expect(parseSignature(null)).toEqual([]);
    expect(parseSignature('')).toEqual([]);
    expect(parseSignature('not json')).toEqual([]);
    expect(parseSignature('[{"points":[{"x":"a"}]}]')).toEqual([]);
    expect(parseSignature('{"points":[]}')).toEqual([]);
  });

  it('serializes [] as null', () => {
    expect(serializeSignature([])).toBeNull();
  });
});

describe('geometry', () => {
  it('computes bounds', () => {
    expect(strokesBounds(strokes)).toEqual({ minX: 12.5, minY: 10, maxX: 100, maxY: 41 });
    expect(strokesBounds([])).toBeNull();
  });

  it('fits and centers strokes like the Swift PDF generator', () => {
    const bounds = { minX: 0, minY: 0, maxX: 360, maxY: 60 };
    const t = fitTransform(bounds, 200, 80, 10);
    // scale = min(180/360, 60/60) = 0.5 → drawn 180×30, centered in 200×80.
    expect(t.scale).toBe(0.5);
    expect(t.offsetX).toBe(10);
    expect(t.offsetY).toBe(25);
  });

  it('handles zero-size bounds without dividing by zero', () => {
    const t = fitTransform({ minX: 5, minY: 5, maxX: 5, maxY: 5 }, 200, 80, 10);
    expect(Number.isFinite(t.scale)).toBe(true);
  });

  it('builds SVG paths', () => {
    expect(strokeToPath(strokes[0].points)).toBe('M 12.5 40 L 13 41');
    expect(strokeToPath(strokes[0].points, { scale: 2, offsetX: 1, offsetY: 0 })).toBe('M 26 80 L 27 82');
    expect(strokeToPath([{ x: 1, y: 1 }])).toBe('M 1 1 L 1.01 1');
    expect(strokeToPath([])).toBe('');
  });
});
