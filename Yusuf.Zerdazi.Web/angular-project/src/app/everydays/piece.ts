import { Theme } from './theme';

export class Piece {
    id: number;
    title: string;
    url: string;
    source: Piece;
    theme: Theme;
}