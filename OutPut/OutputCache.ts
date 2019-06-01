class OutputCache {
    isWin: boolean;
    constructor() {
        // this.isWin = false;
        this.clear();
    }
    clear() {
        this.isWin = false;
    }
    getResult(): boolean {
        return this.isWin;
    }
}

export const g_OutputCache = new OutputCache();