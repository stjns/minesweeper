import { GameCell } from "./GameCell";
import { CellCoordinate } from "./CellCoordinate";

export class GameBoard {
    readonly boardWidth: number;
    readonly boardHeight: number;
    readonly mineCount: number;

    private cells: GameCell[][];

    constructor(width: number, height: number, mines: number) {
        this.boardHeight = height;
        this.boardWidth = width;
        this.mineCount = mines;

        this.cells = [...Array(width)].map(e => Array(height));

        this.populateBoard();
    }

    private generateMineMap(width: number, height: number, mineCount: number): CellCoordinate[] {
        let cellCount = height * width;
        let cellArray: number[] = [...Array(cellCount).keys()];
        const mineMap: CellCoordinate[] = Array(mineCount);

        for (let m = 0; m < mineCount; m++) {
            const randomCellNum = Math.floor(Math.random() * cellArray.length);
            const whichCell = cellArray[randomCellNum];
            cellArray.splice(randomCellNum, 1);
            let mineX = 0;
            let mineY = 0;

            if (whichCell < width) {
                mineX = whichCell;
            } else {
                mineX = Math.floor(whichCell / width);
                mineY = whichCell % width;
            }

            mineMap[m] = new CellCoordinate(mineX, mineY);
        }

        return mineMap
    }

    private isMined = (x: number, y: number, map: CellCoordinate[]) => 
        map.filter(m => m.x === x && m.y === y).length === 1;

    public populateBoard(): void {
        const mineMap = this.generateMineMap(this.boardWidth, this.boardHeight, this.mineCount);
  
        //first generate the board
        for(let y = 0; y < this.boardHeight; y++) {
            for(let x = 0; x < this.boardWidth; x++) {
                const newCell = new GameCell(this.isMined(x,y,mineMap), (result:boolean) => 
                    this.cellRevealCallback(result, x, y));
                this.cells[x][y] = newCell;
            }
        }

        //then calculate the mined neighbors
        for(let y = 0; y < this.boardHeight; y++) {
            for(let x = 0; x < this.boardWidth; x++) {
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
    
    /*
     * When a cell is revealed, this function is run to see what actions
     * the board should take, eg declare win, loss, or propagate an empty
     * cell field. In the latter case, this method is recursive.
     * 
     * If the cell is not empty or mined, we don't need to do anything.
     * 
     * result: false if the cell is mined, true if it is
     * x, y: coordinates for the revealed cell
     */
    private cellRevealCallback(result: boolean, x: number, y: number) {
        if (result) {
            //explode
            this.disableAllCells();
        }
        else if (this.cells[x][y].isEmpty()) {
            for (let x2 = x-1; x2 < x+2; x2++) {
                for (let y2 = y-1; y2 < y+2; y2++) {
                    if (x2 >= 0 
                        && x2 < this.boardWidth 
                        && y2 >= 0 
                        && y2 < this.boardHeight
                        && !this.cells[x2][y2].isRevealed()) {
                            this.cells[x2][y2].reveal();

                        if (this.cells[x2][y2].isEmpty())
                            this.cellRevealCallback(false, x2, y2);
                    }
                }
            }
        }
        else {
            //check for win
            if (this.userHasWon()) {
                this.disableAllCells();
                alert("You win!");
            }
        }
    }

    private userHasWon(): boolean {
        for(const row of this.cells) {
            for (const cell of row) {
                if (!cell.isRevealed() && !cell.mined)
                    return false;
            }
        }

        return true;
    }

    private disableAllCells(): void {
        for(const row of this.cells) {
            for(const cell of row) {
                cell.disable();
            }
        }
    }

    public generateInitialBoard(): HTMLDivElement {
        const mainDiv: HTMLDivElement = document.createElement("div");

        for(let y = 0; y < this.boardHeight; y++) {
            const newCellRow = <HTMLDivElement>document.createElement("div");
            newCellRow.classList.add("cell-row");

            for (let x = 0; x < this.boardWidth; x++) {
                newCellRow.appendChild(this.cells[x][y].el);
            }

            mainDiv.appendChild(newCellRow);
        }
        return mainDiv;
    }
}