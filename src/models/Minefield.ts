import { Cell } from './Cell';
import { CellCoordinate } from './CellCoordinate';

export class Minefield {
    readonly boardWidth: number;
    readonly boardHeight: number;
    readonly mineCount: number;
    private remainingMines = 0;

    private readonly gameStartCallback: Function;
    private readonly gameEndCallback: Function;
    private readonly mineCountCallback: Function;

    private virginBoard = true; //new, untouched minefield

    private cells: Cell[][]; //the virtual representation of the board

    constructor(
        width: number, 
        height: number, 
        mines: number,
        gameStartCallback: Function,
        gameEndCallback: Function,
        mineCountCallback: Function) {
        this.boardHeight = height;
        this.boardWidth = width;
        this.mineCount = mines;
        this.remainingMines = mines;

        this.gameEndCallback = gameEndCallback;
        this.gameStartCallback = gameStartCallback;
        this.mineCountCallback = mineCountCallback;

        this.mineCountCallback(mines);

        this.cells = [...Array(width)].map(e => Array(height));

        this.populateBoard();
    }

    //create a randomized minefield based on height/width/mines specified
    //leave a gap at the point of the initial click
    private generateMineMap(
        initialX: number, 
        initialY: number, 
        width: number, 
        height: number, 
        mineCount: number): CellCoordinate[] {
        const allCells: CellCoordinate[] = []; //all possible cells
        const minedCells: CellCoordinate[] = []; //cells that have a mine

        //populate full cellArray with all possible cell coordinates
        for(let y = 0; y < height; y++) {
            for(let x = 0; x < width; x++) {
                allCells.push(new CellCoordinate(x, y));
            }
        }

        //remove the initial clicked cell and all it's immediate neighbors
        //as possible locations for a mine
        const mineableCells: CellCoordinate[] = [];
        for(const cell of allCells) {
            if ((cell.x >= initialX-1 && cell.x <= initialX+1)
                && (cell.y >= initialY-1 && cell.y <= initialY+1)) {
                    continue;
                }
            mineableCells.push(cell);
        }
       
        //add the specified number of mines randomly to the remaining cells
        for (let m = 0; m < mineCount; m++) {
            const randomCellNum = Math.floor(Math.random() * mineableCells.length);
            minedCells.push(...mineableCells.splice(randomCellNum, 1));
        }

        return minedCells
    }

    public populateBoard(): void {
        for(let y = 0; y < this.boardHeight; y++) {
            for(let x = 0; x < this.boardWidth; x++) {
                const newCell = new Cell((result:boolean) => 
                    this.cellRevealCallback(result, x, y),
                    (flagged: boolean) => this.cellFlagCallback(flagged),
                    (nearby: number) => this.multiFlagCallback(x, y, nearby));
                this.cells[x][y] = newCell;
            }
        }
    }

    //when a cell gets flagged, we need to recalculate the number
    //of remaining mines. Also, this can flag other cells if the
    //user uses the convience feature of flagging a "numbered" 
    //revealed cell.
    private cellFlagCallback(flagged: boolean): void {
        if (flagged) this.mineCountCallback(--this.remainingMines);
        else this.mineCountCallback(++this.remainingMines);
        if(this.checkForWinByFlags()) this.winnerWinner();
    }

    private multiFlagCallback(x: number, y: number, nearbyMined: number): void {
        const nearbyUnflagged: Cell[] = [];
        let nearbyCount = 0;

        const minY = y === 0 ? 0 : y - 1;
        const maxY = y === this.boardHeight - 1 ? y : y+1;
        const minX = x === 0 ? 0 : x-1;
        const maxX = x === this.boardWidth - 1 ? x : x+1;

        for(let itY = minY; itY <= maxY; itY++) {
            for (let itX = minX; itX <= maxX; itX++) {
                if (itX === x && itY === y) continue; //no need to count myself
                const currentCell = this.cells[itX][itY];

                if (!currentCell.isRevealed()) nearbyCount++;

                if (!currentCell.isRevealed() && !currentCell.isFlagged()) {
                    nearbyUnflagged.push(currentCell);
                }
            }
        }

        if (nearbyCount === nearbyMined) {
            nearbyUnflagged.forEach(n => n.toggleFlag());
        }
    }

    //set the number that will appear on the cells near a mine
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

    //right after the first move we need to do a bunch of stuff,
    //like calculating the minefield, enabling flagging
    private firstMove(x: number, y: number): void {
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
                this.cells[x][y].enableFlagging();
            }
        }

        this.calculateMinedNeighbors();
        this.virginBoard = false;
        this.gameStartCallback();
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
        if (this.virginBoard) this.firstMove(x, y);
    
        if (mined) {
            //explode
            this.gameEndCallback();
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
            if (this.checkForWin()) this.winnerWinner();
        }
    }

    //used when the user has won to flag remaining mines
    private flagAllMinesRevealUnrevealed(): void {
        for (const row of this.cells) {
            for (const cell of row) {
                if (cell.isMined() && !cell.isFlagged())
                    cell.toggleFlag();
                else if (!cell.isRevealed())
                    cell.reveal();
            }
        }
    }

    private winnerWinner(): void {
        this.gameEndCallback();
        this.flagAllMinesRevealUnrevealed();
        this.disableAllCells();
    }

    //check to see if the user has won
    //TODO probably a smarter way to do this?
    private checkForWin(): boolean {
        for(const row of this.cells) {
            for (const cell of row) {
                if (!cell.isRevealed() && !cell.isMined())
                    return false;
            }
        }

        return true;
    }

    //check to see if a user has won by flagging all mines
    private checkForWinByFlags = () => this.cells
        .flatMap(r => r.filter(c => c.isMined() && !c.isFlagged()))
        .length === 0;

    //used when the user has won/lost to prevent further clicks
    private disableAllCells(): void {
        for(const row of this.cells) {
            for(const cell of row) {
                cell.gameOver();
            }
        }
    }

    //start a new game!
    public newGame(): HTMLDivElement {
        const mainDiv: HTMLDivElement = document.createElement('div');

        for(let y = 0; y < this.boardHeight; y++) {
            const newCellRow = <HTMLDivElement>document.createElement('div');
            newCellRow.classList.add('cell-row');

            for (let x = 0; x < this.boardWidth; x++) {
                newCellRow.appendChild(this.cells[x][y].htmlElement);
            }

            mainDiv.appendChild(newCellRow);
        }
        return mainDiv;
    }
}