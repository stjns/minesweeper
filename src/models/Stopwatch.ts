export class Stopwatch {
    private interval: number = 0;
    private offset: number = 0;
    readonly timer: HTMLDivElement;
    
    constructor() {
        this.timer = document.createElement('div');
        this.render(0);
    }

    public start(): void {
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
        }
    }

    private update() {
        this.render(Date.now() - this.offset);
    }

    private render(time: number) {
        const minutes = Math.floor(time / 60000)
        const seconds = ((time % 60000) / 1000).toFixed(0)
        this.timer.innerHTML = `${minutes}:${seconds}`;
    }

}