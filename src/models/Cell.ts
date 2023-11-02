// An individual cell within the minefield
export class Cell {
    readonly htmlElement: HTMLDivElement;
    private readonly cellRevealCallback: Function;
    private mineNeighbors = 0; 

    private mined = false;
    private flagged = false;
    private revealed = false;
    private disabled = false;

    constructor(cellRevealCallback: Function) {
        this.htmlElement = <HTMLDivElement>document.createElement('div');
        this.cellRevealCallback = cellRevealCallback;

        this.htmlElement.classList.add('game-cell');
        this.htmlElement.classList.add('un-revealed');

        this.htmlElement.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.toggleFlag();
        });
        this.htmlElement.addEventListener('click', () => this.reveal());
    }

    //set a mine on this cell
    public arm(): void {
        this.mined = true;
        this.mineNeighbors = 1;
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
                this.htmlElement.classList.add('exploded');
                this.htmlElement.innerHTML = '&#x1f4a3;'
            } else {
                this.cellRevealCallback(false);
                if (this.mineNeighbors > 0)
                    this.htmlElement.textContent = this.numNearbyMines().toString();
                
            }

            this.htmlElement.classList.remove('un-revealed');
        } 
    }

    //when the game is over disable the cell from being clicked 
    public disable = () => this.disabled = true;


    //add/remove flag from an unrevelead cell
    public toggleFlag(): void {
        if (!this.disabled && !this.isRevealed()) {
            if (!this.isFlagged()) {
                this.htmlElement.innerHTML = '&#x26f3;';
            } else {
                this.htmlElement.textContent = ' ';
            }

            this.flagged = !this.flagged;
        }
    }

    public isFlagged = () => this.flagged;
    public isRevealed = () => this.revealed;
    public numNearbyMines = () => this.mineNeighbors;
    public isEmpty = () => this.mineNeighbors === 0;
    public isMined = () => this.mined;
}