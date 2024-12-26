export class Spacetime {
    constructor(app) {
        this.app = app
    }

    update(objects) {
        const bezier = new PIXI.Graphics();

        bezier.bezierCurveTo(100, 200, 200, 200, 240, 100);
        bezier.stroke({ width: 5, color: 0xaa0000 });
    
        bezier.position.x = 50;
        bezier.position.y = 50;
    
        //this.app.stage.addChild(bezier);
    }
}