export class MineCounter {
    readonly counterDiv: HTMLDivElement;
    private currentCount: number;

    constructor(initialCount: number) {
        this.counterDiv = document.createElement('div');
        this.counterDiv.id = 'mine-counter';
        this.currentCount = initialCount;
        this.render();
    }

    public adjustCount(change:number): void {
        this.currentCount += change;
        this.render();
    }

    private render(): void {
        this.counterDiv.textContent = `Remaining Mines: ${this.currentCount}`;
    }
}