// World space follows the original isometric illustration (src/assets/home.svg): the back corner of
// the room is the origin, +X runs along the right-hand wall, +Z along the left-hand wall and +Y is up.
// One world unit is a metre, and 100 SVG units along any isometric axis.

export const ROOM_SIZE = 4.49;
export const WALL_HEIGHT = 2.245;
export const WALL_THICKNESS = 0.05;

// The room sits on a slab like a diorama; the ground plane is this far below the floor
export const BASE_DEPTH = 0.25;

// The balcony sits off the open side of the room, in line with the back (right-hand) wall, with its own railing
export const BALCONY = { x0: ROOM_SIZE, x1: ROOM_SIZE + 1.5, z0: 0, z1: 2.6 };

// SVG position of the back floor corner of the original illustration
const ORIGIN_X = 389;
const ORIGIN_Y = 259.2;
const COS30 = Math.cos(Math.PI / 6) * 100;

// Isometric camera elevation: atan(1 / sqrt(2)) ≈ 35.26°
export const ISO_ELEVATION = Math.atan(1 / Math.SQRT2);

export type Vec3 = [number, number, number];

// The window in the left-hand wall, above the desk (wall coordinates: z along the wall, y up)
export const WINDOW = { z0: 0.35, z1: 1.35, y0: 1.2, y1: 1.95 };

// Invisible hover hit boxes live on their own layer so they never render, cast shadows or appear in
// reflections; only the room's raycaster enables it
export const HIT_LAYER = 1;

// SVG transform that unprojects artwork drawn on the right-hand wall (the Z = 0 plane) into a flat
// texture covering wall coordinates x ∈ [x0, x1], y ∈ [y0, y1] at `scale` pixels per unit
export const rightWallUnprojection = (x0: number, y1: number, scale: number) => {
    const a = scale / COS30;
    const b = (-0.5 * scale) / COS30;
    const d = scale / 100;
    const e = -scale * (ORIGIN_X / COS30 + x0);
    const f = scale * (y1 - ORIGIN_Y / 100 + (0.5 * ORIGIN_X) / COS30);
    return `matrix(${a} ${b} 0 ${d} ${e} ${f})`;
};
