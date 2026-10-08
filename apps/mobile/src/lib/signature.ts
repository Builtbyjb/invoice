import { z } from "zod";

import { strokeSchema, type Point, type Stroke } from "../schemas/invoice";

const strokesSchema = z.array(strokeSchema);

/** Decodes the JSON-encoded `Stroke[]` stored on an invoice. Returns [] on any failure. */
export function parseSignature(s?: string | null): Stroke[] {
    if (!s) return [];
    try {
        const parsed = strokesSchema.safeParse(JSON.parse(s));
        return parsed.success ? parsed.data : [];
    } catch {
        return [];
    }
}

/**
 * Encodes strokes as a JSON string compatible with the Swift app
 * (`[{"points":[{"x":1,"y":2}]}]`). Returns null when there are no strokes.
 */
export function serializeSignature(strokes: readonly Stroke[]): string | null {
    if (strokes.length === 0) return null;
    return JSON.stringify(
        strokes.map((s) => ({ points: s.points.map((p) => ({ x: p.x, y: p.y })) })),
    );
}

export type Bounds = { minX: number; minY: number; maxX: number; maxY: number };

export function strokesBounds(strokes: readonly Stroke[]): Bounds | null {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const stroke of strokes) {
        for (const p of stroke.points) {
            minX = Math.min(minX, p.x);
            minY = Math.min(minY, p.y);
            maxX = Math.max(maxX, p.x);
            maxY = Math.max(maxY, p.y);
        }
    }
    return Number.isFinite(minX) ? { minX, minY, maxX, maxY } : null;
}

export type Transform = { scale: number; offsetX: number; offsetY: number };

export const IDENTITY: Transform = { scale: 1, offsetX: 0, offsetY: 0 };

/** Port of the PDF signature math: scale strokes to fit a box with padding, centered. */
export function fitTransform(bounds: Bounds, boxW: number, boxH: number, padding = 10): Transform {
    const dx = Math.max(bounds.maxX - bounds.minX, 1);
    const dy = Math.max(bounds.maxY - bounds.minY, 1);
    const scale = Math.min((boxW - 2 * padding) / dx, (boxH - 2 * padding) / dy);
    const drawnW = (bounds.maxX - bounds.minX) * scale;
    const drawnH = (bounds.maxY - bounds.minY) * scale;
    return {
        scale,
        offsetX: (boxW - drawnW) / 2 - bounds.minX * scale,
        offsetY: (boxH - drawnH) / 2 - bounds.minY * scale,
    };
}

const round = (n: number) => Math.round(n * 100) / 100;

export function applyTransform(p: Point, t: Transform = IDENTITY): Point {
    return { x: p.x * t.scale + t.offsetX, y: p.y * t.scale + t.offsetY };
}

/** SVG path `d` for a stroke. Single-point strokes become a tiny segment so round caps draw a dot. */
export function strokeToPath(points: readonly Point[], transform: Transform = IDENTITY): string {
    if (points.length === 0) return "";
    const pts = points.map((p) => applyTransform(p, transform));
    const [first, ...rest] = pts;
    if (rest.length === 0) {
        return `M ${round(first.x)} ${round(first.y)} L ${round(first.x + 0.01)} ${round(first.y)}`;
    }
    return (
        `M ${round(first.x)} ${round(first.y)}` +
        rest.map((p) => ` L ${round(p.x)} ${round(p.y)}`).join("")
    );
}
