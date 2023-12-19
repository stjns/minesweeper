import { Cell } from "./Cell"

export class NearbyCellMap {
    public Unflagged: Cell[] = [];
    public Flagged: Cell[] = [];
    public Unrevealed: number = 0;
}