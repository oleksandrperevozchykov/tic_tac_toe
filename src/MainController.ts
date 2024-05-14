import Model from './Model'
import View from './View'
import {Application} from "pixi.js";
export default class MainController {
    protected app: Application
    protected model: Model
    protected view: View
    protected buttonsInteractive: boolean = false;
    constructor(app: Application) {
        this.app = app;
        this.model = new Model()
        this.model.init();
        this.view = new View(app)
    }

    public init(): void {
        this.view.init((name) => this.buttonHandler(name));
        this.buttonsInteractive = true;
    }

    protected buttonHandler(name: string): void {
        if (!this.buttonsInteractive) return;
        this.buttonsInteractive = false;
        const [row,col] = name.split('_').slice(1).map((str) => Number(str));
        this.model.addSignToField(row, col, 'x');
        this.model.checkWinner();
        this.view.playShowAnimation('x', row, col, () => {
            if (this.model.isWin()) {
                this.view.setText('Cross wins!', true)
                this.view.playWinAnimation('x', this.model.getWinnerRows(),  () => {
                   this.resetGame();
                   return;
                });
            } else if (this.model.isDraw()) {
                this.view.setText('Draw :(', true)
                this.resetGame();
                return;
            } else {
                this.playCompTurn();
            }
        });
    }

    protected playCompTurn(): void {
        const {row, col} = this.model.checkBestMove();
        this.model.addSignToField(row, col, 'o');
        this.model.checkWinner();
        if (this.model.isDraw()) {
            this.view.setText('Draw :(', true)
            this.resetGame();
            return;
        }
        this.view.playShowAnimation('o', row, col, () => {
            if (this.model.isWin()) {
                this.view.setText('Circles wins!', false)
                this.view.playWinAnimation('o', this.model.getWinnerRows(),  () => {
                    this.resetGame();
                    return;
                })
            } else if (this.model.isDraw()) {
                this.view.setText('Draw :(', true)
                this.resetGame();
                return;
            } else {
                this.buttonsInteractive = true;
            }
        })
    }

    protected  resetGame(): void {
        setTimeout(() => {
            this.model.resetField();
            this.view.resetGameField();
            this.buttonsInteractive = true;
        },1000);
    }
}