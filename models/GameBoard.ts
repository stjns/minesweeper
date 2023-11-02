import { GameCell } from "./GameCell";
import { CellCoordinate } from "./CellCoordinate";

export class GameBoard {
    readonly boardWidth: number;
    readonly boardHeight: number;
    readonly mineCount: number;

    private virginBoard = true;

    private cells: GameCell[][];

    constructor(width: number, height: number, mines: number) {
        this.boardHeight = height;
        this.boardWidth = width;
        this.mineCount = mines;

        this.cells = [...Array(width)].map(e => Array(height));

        this.populateBoard();
    }

    private generateMineMap(
        initialX: number, 
        initialY: number, 
        width: number, 
        height: number, 
        mineCount: number): CellCoordinate[] {
        const cellArray: CellCoordinate[] = [];
        const mineMap: CellCoordinate[] = [];

        //populate full cellArray with all possible cell coordinates
        for(let y = 0; y < height; y++) {
            for(let x = 0; x < width; x++) {
                cellArray.push(new CellCoordinate(x, y));
            }
        }

        //remove the initial clicked cell and all it's immediate neighbors
        //as possible locations for a mine
        const mineableCells: CellCoordinate[] = [];
        for(const cell of cellArray) {
            if ((cell.x >= initialX-1 && cell.x <= initialX+1)
                && (cell.y >= initialY-1 && cell.y <= initialY+1)) {
                    continue;
                }
            mineableCells.push(cell);
        }
       
        //add the specified number of mines randomly to the remaining cells
        for (let m = 0; m < mineCount; m++) {
            const randomCellNum = Math.floor(Math.random() * mineableCells.length);
            
            mineMap.push(...mineableCells.splice(randomCellNum, 1));
        }

        return mineMap
    }

    public populateBoard(): void {
        //first generate the board
        for(let y = 0; y < this.boardHeight; y++) {
            for(let x = 0; x < this.boardWidth; x++) {
                const newCell = new GameCell((result:boolean) => 
                    this.cellRevealCallback(result, x, y));
                this.cells[x][y] = newCell;
            }
        }
    }

    private calculateMinedNeighbors(): void {
        for(let y = 0; y < this.boardHeight; y++) {
            for(let x = 0; x < this.boardWidth; x++) {
                if(!this.cells[x][y].isMined()) {
                    let count = 0;

                    //calculate current row
                    if (x > 0 && this.cells[x-1][y].isMined()) count++;
                    if (x < this.boardWidth - 1 && this.cells[x+1][y].isMined()) count++;
    
                    //calculate above row
                    if (y > 0) {
                        if (x > 0 && this.cells[x-1][y-1].isMined()) count++;
                        if (this.cells[x][y-1].isMined()) count++;
                        if (x < this.boardWidth - 1 && this.cells[x+1][y-1].isMined()) count++;
                    }
    
                    //calculate below row
                    if (y < this.boardHeight - 1) {
                        if (x > 0 && this.cells[x-1][y+1].isMined()) count++;
                        if (this.cells[x][y+1].isMined()) count++;
                        if (x < this.boardWidth - 1 && this.cells[x+1][y+1].isMined()) count++;
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
    private cellRevealCallback(mined: boolean, x: number, y: number) {
        //on the first click, we need to calculate the mines before we
        //do anything else
        if (this.virginBoard) {
            const mineMap = this.generateMineMap(
                x,
                y,
                this.boardWidth, 
                this.boardHeight, 
                this.mineCount
            );

            for(let y = 0; y < this.boardHeight; y++) {
                for(let x = 0; x < this.boardWidth; x++) {
                    if (mineMap.some(c => c.x === x && c.y === y))
                        this.cells[x][y].arm();
                }
            }

            this.calculateMinedNeighbors();
            this.virginBoard = false;
        }
    
        if (mined) {
            //explode
            this.disableAllCells();
        }
        else if (this.cells[x][y].isEmpty()) {
            //propagate empty cells
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
                this.flagAllMines();
                this.disableAllCells();
                //TODO replace alert with something better
                alert("You win!");
            }
        }
    }

    //used when the user has won to flag remaining mines
    private flagAllMines(): void {
        for (const row of this.cells) {
            for (const cell of row) {
                if (cell.isMined() && !cell.isFlagged())
                    cell.onFlagToggle();
            }
        }
    }

    //check to see if the user has won
    //TODO probably a smarter way to do this?
    private userHasWon(): boolean {
        for(const row of this.cells) {
            for (const cell of row) {
                if (!cell.isRevealed() && !cell.isMined())
                    return false;
            }
        }

        return true;
    }

    //used when the user has won/lost to prevent further clicks
    private disableAllCells(): void {
        for(const row of this.cells) {
            for(const cell of row) {
                cell.disable();
            }
        }
    }

    //start a new game!
    public newGame(): HTMLDivElement {
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