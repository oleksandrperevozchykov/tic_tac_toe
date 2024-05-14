import {RowCol} from "./types";

export default class Model {
    protected hasWinner: boolean = false;
    protected draw: boolean = false;
    protected winner: string = '';
    protected winnerCells: RowCol[] = [];
    protected field: string[][] = [];

    constructor() {
    }

    public init(): void {
        this.field = this.createNewField();
    }

    public addSignToField(row: number, col: number, sign: string): void {
        this.field[row][col] = sign;
    }

    public isWin(): boolean {
        return this.hasWinner;
    }

    public isDraw(): boolean {
        return this.draw;
    }

    public checkWinner(): void {
        let hasWinner = false;
        const setWin = (lineName: string, lineNum: number, winner: string) => {
            hasWinner = true;
            let winCells = []
            switch (lineName) {
                case 'row':
                    for (let i = 0; i < 3; i++) { winCells.push({row: lineNum, col: i}) }
                    break
                case 'col':
                    for (let i = 0; i < 3; i++) { winCells.push({row: i, col: lineNum}) }
                    break
                case 'diag':
                    winCells = lineNum === 1 ? [{row: 0, col: 0}, {row: 1, col: 1}, {row: 2, col: 2}] : [{row: 0, col: 2}, {row: 1, col: 1}, {row: 2, col: 0}]
                    break
            }
            this.setWinner(winCells, winner);
        }
        for (let i = 0; i < 3; i++) {
            // check row
            if (this.checkForSigns(this.field[i], 3, 'o')) setWin('row', i, 'o');
            if (this.checkForSigns(this.field[i], 3, 'x')) setWin('row', i, 'x');
            // check column
            const col = [this.field[0][i],this.field[1][i], this.field[2][i]];
            if (this.checkForSigns(col, 3, 'o')) setWin('col', i, 'o');
            if (this.checkForSigns(col, 3, 'x')) setWin('col', i, 'x');
        }
        // check diagonals
        const diag1 = [this.field[0][0],this.field[1][1], this.field[2][2]];
        if (this.checkForSigns(diag1, 3, 'o')) setWin('diag', 1, 'o');
        if (this.checkForSigns(diag1, 3, 'x')) setWin('diag', 1, 'x');
        const diag2 = [this.field[0][2],this.field[1][1], this.field[2][0]];
        if (this.checkForSigns(diag2, 3, 'o')) setWin('diag', 2, 'o');
        if (this.checkForSigns(diag2, 3, 'x')) setWin('diag', 2, 'x');

        const flat = this.field.flat();
        if (!hasWinner && !flat.includes('')) this.draw = true;
    }

    public getWinnerRows():RowCol[] {
        return this.winnerCells;
    }
    public resetField(): void {
        this.draw = false
        this.hasWinner = false;
        this.winnerCells = [];
        this.winner = '';
        this.field = this.createNewField();
    }

    public checkBestMove(): RowCol {
        let row = 1;
        let col = 1;
        for (let i = 0; i < 3; i++) {
            // check row
            if (this.checkForSigns(this.field[i], 2, 'o') && this.field[i].includes('')) return {row: i, col: this.field[i].findIndex(str => str === '')};
            if (this.checkForSigns(this.field[i], 2, 'x') && this.field[i].includes('')) return {row: i, col: this.field[i].findIndex(str => str === '')};
            // check column
            const col = [this.field[0][i],this.field[1][i], this.field[2][i]];
            if (this.checkForSigns(col, 2, 'o') && col.includes('')) return {row: col.findIndex(str => str === ''), col: i};
            if (this.checkForSigns(col, 2, 'x') && col.includes('')) return {row: col.findIndex(str => str === ''), col: i};
        }
        // check diagonals
        const diag1 = [this.field[0][0],this.field[1][1], this.field[2][2]];
        if (this.checkForSigns(diag1, 2, 'o') && diag1.includes('')) return {row: diag1.findIndex(str => str === ''), col: diag1.findIndex(str => str === '')};
        if (this.checkForSigns(diag1, 2, 'x') && diag1.includes('')) return {row: diag1.findIndex(str => str === ''), col: diag1.findIndex(str => str === '')};
        const diag2 = [this.field[0][2],this.field[1][1], this.field[2][0]];
        if (this.checkForSigns(diag2, 2, 'o') && diag2.includes('')) return {row: diag2.findIndex(str => str === ''), col: diag2.reverse().findIndex(str => str === '')};
        if (this.checkForSigns(diag2, 2, 'x') && diag2.includes('')) return {row: diag2.findIndex(str => str === ''), col: diag2.reverse().findIndex(str => str === '')};
        if (this.field[row][col] !== '') {
            const flat = this.field.flat();
            const index = flat.findIndex(str => str ===  '')
            row = index < 3 ? 0 : index < 5 ? 1 : 2;
            col = index < 3 ? index : index % (row * 3)
        }
        return {row, col};
    }

    protected checkForSigns(arr: string[], num: number, sign: string): boolean {
        const filteredArr = arr.filter(str => str === sign);
        if (filteredArr.length === num) return true;
        return false
    }

    protected setWinner(winCells: RowCol[], sign: string) {
        this.hasWinner = true;
        this.draw = false;
        this.winner = sign;
        this.winnerCells = winCells;

    }

    protected createNewField(): string[][] {
        const arr = []
        for (let i = 0; i < 3; i++) {
            const arr2 = []
            for (let j = 0; j < 3; j++) {
                arr2[j] = '';
            }
            arr[i] = arr2;
        }
        return arr;
    }


}
