// An individual cell within the minefield
export class Cell {
    readonly htmlElement: HTMLDivElement;
    private readonly cellRevealCallback: Function;
    private readonly cellFlagCallback: Function;
    private mineNeighbors = 0; 

    private mined = false;
    private flagged = false;
    private exploded = false;
    private revealed = false;
    private disabled = false;
    private flaggingEnabled = false;
    private touchTimer = 0;

    private readonly BOMB_CODE = '&#x1f4a3;';
    private readonly FLAG_CODE = '&#x26f3;';

    constructor(cellRevealCallback: Function, cellFlagCallback: Function) {
        this.htmlElement = <HTMLDivElement>document.createElement('div');
        this.cellRevealCallback = cellRevealCallback;
        this.cellFlagCallback = cellFlagCallback;

        this.htmlElement.classList.add('game-cell');
        this.htmlElement.classList.add('un-revealed');

        this.htmlElement.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.toggleFlag();
        });
        this.htmlElement.addEventListener('click', () => this.reveal());
        this.htmlElement.addEventListener('touchstart', (e) => this.touchHandler(e));
        this.htmlElement.addEventListener('touchend', () => this.cancelTouch());
        this.htmlElement.addEventListener('touchmove', () => this.cancelTouch());
    }

    private touchHandler(e: TouchEvent) {
        e.preventDefault();
        if (!this.touchTimer) {
            this.touchTimer = setTimeout(() => {
                this.touchTimer = 0;
                this.toggleFlag();
            }, 250);
        }
    }

    private cancelTouch(): void {
        if (this.touchTimer) {
            clearTimeout(this.touchTimer);
            this.reveal();
        }
    }

    //set a mine on this cell
    public arm(): void {
        this.mined = true;
        this.mineNeighbors = 1;
    }

    //needed to prevent a bug for flagging before the game has started
    public enableFlagging(): void {
        this.flaggingEnabled = true;
    }

    //set the number that will appear on a cell
    public setMinedNeighbors(minedNeighbors: number) {
        if (!this.mined)
            this.mineNeighbors = minedNeighbors;
    }

    //action when an unflagged cell is clicked
    public reveal() {
        if (!this.disabled && !this.flagged && !this.revealed) {
            this.revealed = true;

            if (this.mined) {
                this.cellRevealCallback(true);
                this.exploded = true;
                this.htmlElement.classList.add('exploded');
                this.htmlElement.innerHTML = this.BOMB_CODE;
            } else {
                this.cellRevealCallback(false);
                if (this.mineNeighbors > 0)
                    this.htmlElement.textContent = this.numNearbyMines().toString();
                
            }

            this.htmlElement.classList.remove('un-revealed');
        } 
    }

    //when the game is over disable the cell from being clicked 
    public gameOver() {
        this.disabled = true;

        if (this.mined && !this.flagged && !this.exploded) {
            this.htmlElement.classList.add('unexploded-mine');
            this.htmlElement.innerHTML = this.BOMB_CODE;
        }
        else if (!this.mined && this.flagged) {
            this.htmlElement.classList.add('bad-flag')
        }
    }


    //add/remove flag from an unrevelead cell
    public toggleFlag(): void {
        if (this.flaggingEnabled && !this.disabled && !this.isRevealed()) {
            if (!this.isFlagged()) {
                this.htmlElement.innerHTML = this.FLAG_CODE;
            } else {
                this.htmlElement.textContent = ' ';
            }

            this.flagged = !this.flagged;
            this.cellFlagCallback(this.flagged);
        }
    }

    public isFlagged = () => this.flagged;
    public isRevealed = () => this.revealed;
    public numNearbyMines = () => this.mineNeighbors;
    public isEmpty = () => this.mineNeighbors === 0;
    public isMined = () => this.mined;
}