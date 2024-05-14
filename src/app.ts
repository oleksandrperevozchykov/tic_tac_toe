import {Application } from "pixi.js";
import AssetLoader from "./loader";
import MainController from "./MainController";

export class App {
    protected assetLoader: AssetLoader;
    protected app: Application
    constructor() {
            const app = new Application({
                width: 1920,
                height: 1080,
                backgroundColor:0x1ccbb8,
            });
            this.app = app;
            document.body.appendChild(app.view);


        this.assetLoader = new AssetLoader(app);
        this.start();

    }

    protected start(): void {
        this.assetLoader.loadAssets(() => {
            const mainController = new MainController(this.app);
            mainController.init();
        });

    }

}
