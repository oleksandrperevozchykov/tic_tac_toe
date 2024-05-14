import { Application } from "pixi.js";

export default class AssetLoader {
    protected application: Application;
    constructor(app: Application) {
        this.application = app;
    }

    public loadAssets(cb: any): void {
        const loader = this.application.loader;
        loader.baseUrl = "./assets/";
        loader.add('darkFont', 'fonts/darkFont.fnt')
        loader.add('lightFont', 'fonts/lightFont.fnt')
        loader.add('playfield', 'playfield.png')
        // loader.load((loader, resources) => console.log(resources))
        const options = {
            metadata: {
                spineAtlasFile: 'spine.atlas'
            }
        }
        loader.add('circle', 'circle.json', options);
        loader.add('cross', 'cross.json', options);
        loader.onComplete.add((loader, resources) => {
            cb(resources);
        });
        loader.load();

    }
}