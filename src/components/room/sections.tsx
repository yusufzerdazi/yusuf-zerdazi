/* eslint-disable react-refresh/only-export-components -- shared registry of section objects, not a component module */
import { ReactNode, createContext, useContext } from 'react';
import { Vec3 } from './iso';
import { Computer, Tickets } from './models/Desk';
import { DjSetup, Guitar } from './models/Music';
import { LedPanel, MagicMirror, Painting, SecurityCamera } from './models/Wall';
import { Cat, DreamJournal, GameController } from './models/Lounge';
import { Plant, Robot } from './models/Floor';

// Which way each object hops when hovered, away from the surface it rests on
const UP: Vec3 = [0, 0.05, 0];
const OFF_LEFT_WALL: Vec3 = [0.05, 0, 0];
const OFF_RIGHT_WALL: Vec3 = [0, 0, 0.05];

// The 3D object that represents each portfolio section, used in the room, the modal and the thumbnails
export const SECTION_MODELS: Record<string, { lift: Vec3; render: (painting: string) => ReactNode }> = {
    Dreams: { lift: UP, render: () => <DreamJournal /> },
    Security: { lift: OFF_RIGHT_WALL, render: () => <SecurityCamera /> },
    Music: { lift: UP, render: () => <Guitar /> },
    Art: { lift: OFF_RIGHT_WALL, render: painting => <Painting src={painting} /> },
    Games: { lift: UP, render: () => <GameController /> },
    DJ: { lift: UP, render: () => <DjSetup /> },
    LED: { lift: OFF_LEFT_WALL, render: () => <LedPanel /> },
    MagicMirror: { lift: OFF_LEFT_WALL, render: () => <MagicMirror /> },
    Car: { lift: UP, render: () => <Robot /> },
    Cat: { lift: UP, render: () => <Cat /> },
    TicketSlick: { lift: UP, render: () => <Tickets /> },
    Computer: { lift: [0, 0.03, 0], render: () => <Computer /> },
    Values: { lift: UP, render: () => <Plant /> },
};

// Each section's accent colour, evenly spaced around the hue wheel in section order as before
export const sectionAccent = (sectionIds: string[], id: string, lightness = 60) => {
    const hue = (sectionIds.indexOf(id) * (360 / sectionIds.length)) % 360;
    return `hsl(${hue}, 70%, ${lightness}%)`;
};

// Staggered start for each object's idle shimmer
export const sectionDelay = (sectionIds: string[], id: string) => {
    const index = sectionIds.indexOf(id);
    return index * 0.55 + Math.sin(index * 0.7) * 0.4;
};

// True when an object is rendered on its own (modal turntable, thumbnails) rather than in the room,
// so room-only extras like light spill on the walls can be left out
export const PreviewContext = createContext(false);
export const usePreview = () => useContext(PreviewContext);
