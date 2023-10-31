import { GameCell } from "./GameCell";

export class GameBoard {
    readonly boardWidth: number;
    readonly boardHeight: number;

    private cells: GameCell[][];

    constructor(width: number, height: number) {
        this.boardHeight = height;
        this.boardWidth = width;

        this.cells = [...Array(width)].map(e => Array(height));

        this.populateBoard();
    }

    public populateBoard(): void {
        //first generate the board
        for(let y = 0; y < this.boardWidth; y++) {
            for(let x = 0; x < this.boardHeight; x++) {
                const newCell = new GameCell(this.isMined(), () => this.propagateEmptyCell(x, y));
                this.cells[x][y] = newCell;
            }
        }

        //then calculate the mined neighbors
        for(let y = 0; y < this.boardWidth; y++) {
            for(let x = 0; x < this.boardHeight; x++) {
                if(!this.cells[x][y].mined) {
                    let count = 0;

                    //calculate current row
                    if (x > 0 && this.cells[x-1][y].mined) count++;
                    if (x < this.boardWidth - 1 && this.cells[x+1][y].mined) count++;
    
                    //calculate above row
                    if (y > 0) {
                        if (x > 0 && this.cells[x-1][y-1].mined) count++;
                        if (this.cells[x][y-1].mined) count++;
                        if (x < this.boardWidth - 1 && this.cells[x+1][y-1].mined) count++;
                    }
    
                    //calculate below row
                    if (y < this.boardHeight - 1) {
                        if (x > 0 && this.cells[x-1][y+1].mined) count++;
                        if (this.cells[x][y+1].mined) count++;
                        if (x < this.boardWidth - 1 && this.cells[x+1][y+1].mined) count++;
                    }
    
                    this.cells[x][y].setMinedNeighbors(count);
                }
            }
        }
    }
    
    private propagateEmptyCell(x: number, y: number) {
        if (this.cells[x][y].isEmpty()) {
            for (let x2 = x-1; x2 < x+2; x2++) {
                for (let y2 = y-1; y2 < y+2; y2++) {
                    if (x2 >= 0 
                        && x2 < this.boardWidth 
                        && y2 >= 0 
                        && y2 < this.boardHeight
                        && !this.cells[x2][y2].isRevealed()) {
                            this.cells[x2][y2].reveal();

                        if (this.cells[x2][y2].isEmpty())
                            this.propagateEmptyCell(x2, y2);
                    }
                }
            }
        }
    }

    public generateInitialBoard(): HTMLDivElement {
        const mainDiv: HTMLDivElement = document.createElement("div");

        for(let y = 0; y < this.boardWidth; y++) {
            const newCellRow = <HTMLDivElement>document.createElement("div");
            newCellRow.classList.add("cell-row");

            for (let x = 0; x < this.boardHeight; x++) {
                newCellRow.appendChild(this.cells[x][y].el);
            }

            mainDiv.appendChild(newCellRow);
        }
        return mainDiv;
    }

    private isMined(): boolean {
        return Math.floor(Math.random() * 5) === 1;
    }
}