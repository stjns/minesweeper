export class GameCell {
    readonly el: HTMLDivElement;
    private readonly cellRevealCallback: Function;
    private mineNeighbors = 0; 

    private mined = false;
    private flagged = false;
    private revealed = false;
    private disabled = false;

    constructor(cellRevealCallback: Function) {
        this.el = <HTMLDivElement>document.createElement('div');
        this.cellRevealCallback = cellRevealCallback;

        this.el.classList.add("game-cell");
        this.el.classList.add('un-revealed');

        this.el.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.onFlagToggle();
        });
        this.el.addEventListener('click', () => this.onCellClick());
    }

    public arm(): void {
        this.mined = true;
        this.mineNeighbors = 1;
    }

    public setMinedNeighbors(minedNeighbors: number) {
        if (!this.mined)
            this.mineNeighbors = minedNeighbors;
    }

    public reveal() {
        if (!this.flagged && !this.revealed) {
            this.revealed = true;

            if (this.mined) {
                this.cellRevealCallback(true);
                this.el.classList.add('exploded');
                this.el.innerHTML = '&#x1f4a3;'
            } else {
                this.cellRevealCallback(false);
                if (this.mineNeighbors > 0)
                    this.el.textContent = this.numNearbyMines().toString();
                
            }

            this.el.classList.remove('un-revealed');
        } 
    }

    public disable = () => this.disabled = true;

    private onCellClick(): void {
        if (!this.disabled && !this.isRevealed() && !this.isFlagged()) {
            this.reveal();
        }
    }

    public onFlagToggle(): void {
        if (!this.disabled && !this.isRevealed()) {
            if (!this.isFlagged()) {
                this.el.innerHTML = '&#x26f3;';
            } else {
                this.el.textContent = ' ';
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