export class Stopwatch {
    private interval: number = 0;
    private offset: number = 0;
    readonly timer: HTMLDivElement;
    
    constructor() {
        this.timer = document.createElement('div');
        this.timer.classList.add('game-timer');
        this.render(0);
    }

    public start(): void {
        this.reset();
        if (!this.interval) {
            this.offset = Date.now();
            this.interval = setInterval(() => this.update(),100);
        }
    }

    public reset() {
        this.stop();
        this.render(0);
    }

    public stop(): void {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = 0;
        }
    }

    private update() {
        this.render(Date.now() - this.offset);
    }

    private render(time: number) {
        const minutes = Math.floor(time / 60000).toString().padStart(2, '0');
        const seconds = ((time % 60000) / 1000).toFixed(1).padStart(4, '0');
        this.timer.innerHTML = `${minutes}:${seconds}`;
    }

}