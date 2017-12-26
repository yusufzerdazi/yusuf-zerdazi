import { Theme } from './theme';
import { Everyday } from './everyday';

export class Month {
    id: number;
    start: Date;
    themes: Theme[];
    everydays: Everyday[];
}