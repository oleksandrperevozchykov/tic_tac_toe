import {Application, BitmapText, Container, Graphics, LoaderResource, Sprite} from "pixi.js";
import {ITrackEntry, Spine} from "pixi-spine";
import {RowCol} from "./types";

export default class View extends Container {
    protected app: Application;
    protected lightText: BitmapText;
    protected darkText: BitmapText;
    protected crosses: Spine[] = [];
    protected circles: Spine[] = [];
    protected buttons: Graphics[] = [];
    protected cellsContainer: Container;
    protected playfieldSprite: Sprite;

    constructor(app: Application) {
        super();
        this.app = app;
        this.cellsContainer = new Container();
        this.cellsContainer.position.set(960, 540);
        this.cellsContainer.name = 'cellscontainer'
    }

    public init(onButtonPressed: any): void {
        this.createTexts();
        this.createCells();
        this.createPlayfield();
        this.setButtonsHandlers(onButtonPressed)
    }

    protected setButtonsHandlers(handler: any): void {
        this.buttons.forEach((button) => {
            button.on('click',() => handler(button.name));
        })
    }

    public playShowAnimation(sign: string, row: number, col: number, cb?: any): void {
        const spines = sign === 'x' ? this.crosses : this.circles;
        const spine = spines.find((spine) => spine.name === `${sign === 'x' ? 'Cross' : 'Circle'}_row_${row}_col_${col}`);
        spine.visible = true;
        spine.state.setAnimation(0, 'draw', false);
        spine.state.addListener({
            complete: (entry: ITrackEntry)  => {
                spine.state.clearListeners();
                if (cb) cb();
            }});
    }

    public playWinAnimation(sign: string, rows: RowCol[], cb?: any): void {
        const spines = sign === 'x' ? this.crosses : this.circles;
        rows.forEach((rowCol, index) => {
            const spine = spines.find((spine) => spine.name === `${sign === 'x' ? 'Cross' : 'Circle'}_row_${rowCol.row}_col_${rowCol.col}`);
            spine.visible = true;
            spine.state.clearTracks();
            spine.state.setAnimation(0, 'win', false);
            spine.state.addListener({
                complete: (entry: ITrackEntry)  => {
                    spine.state.clearListeners();
                    if (cb && index === 0) cb();
                }});
        })
    }

    public setText(text: string, isDark: boolean) {
        if (isDark) {
            this.darkText.text = text;
            this.darkText.position.set(this.app.view.width/2 , 50);
        }
        else {
            this.lightText.text = text;
            this.lightText.position.set(this.app.view.width/2 , 50);
        }
    }

    public resetGameField(): void {
        this.crosses.forEach((cross) => {
            cross.visible = false;
            cross.state.clearTracks();
        })
        this.circles.forEach((circle) => {
            circle.visible = false;
            circle.state.clearTracks();
        })
        this.lightText.text = '';
        this.darkText.text = '';
    }

    protected createCells() {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const circle = new Spine(this.app.loader.resources.circle.spineData);
                const cross = new Spine(this.app.loader.resources.cross.spineData);
                circle.position.set(this.app.view.width/2 - 210 + (210 * j), this.app.view.height/2 - 210 + (210 * i));
                cross.position.set(this.app.view.width/2 - 210 + (210 * j), this.app.view.height/2 - 210 + (210 * i));
                const button= this.createButton();
                button.position.set(this.app.view.width/2 - 315 + (210 * j), this.app.view.height/2 - 315 + (210 * i));

                circle.name = `Circle_row_${i}_col_${j}`;
                cross.name = `Cross_row_${i}_col_${j}`;
                button.name = `Button_${i}_${j}`;
                this.circles.push(circle);
                this.crosses.push(cross);
                this.buttons.push(button);
                circle.visible = false;
                cross.visible = false;
                this.app.stage.addChild(circle);
                this.app.stage.addChild(cross);
                this.app.stage.addChild(button);
            }
        }
    }

    protected createPlayfield(): void {
        const sprite = new Sprite(this.app.loader.resources['playfield'].texture);
        this.playfieldSprite = sprite;
        sprite.position.set(this.app.view.width/2 - sprite.width/2, this.app.view.height/2 - sprite.height/2)
        this.app.stage.addChild(sprite)
    }
    protected createButton(): Graphics {
        const button= new Graphics();
        button.beginFill(0x000000, 0.001);
        button.drawRect(0,0,210,210);
        button.endFill();
        button.interactive = true;
        button.buttonMode = true;
        return button;
    }

    protected createTexts() {

        const darkFont = this.app.loader.resources['darkFont'].bitmapFont;
        const lightFont = this.app.loader.resources['lightFont'].bitmapFont;
        this.darkText = new BitmapText('', {
            fontName: darkFont.font,
            fontSize: 60,
            align: 'center'
        })
        this.lightText = new BitmapText('', {
            fontName: lightFont.font,
            fontSize: 60,
            align: 'center'
        })
        this.darkText.position.set(this.app.view.width/2 , 50);
        this.lightText.position.set(this.app.view.width/2 , 50);
        this.app.stage.addChild(this.darkText);
        this.app.stage.addChild(this.lightText);

    }
}