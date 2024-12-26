export class Spacetime {
    constructor(app) {
        this.app = app
    }

    update(objects) {
        for (let i = 10; i < this.app.screen.width; i += 50) {
            this.createLine(
                [i, 0],
                [i, this.app.screen.height / 3],
                [i, (2 * this.app.screen.height) / 3],
                [i, this.app.screen.height],
            )
        }

        for (let i = 10; i < this.app.screen.height; i += 50) {
            this.createLine(
                [0, i],
                [this.app.screen.width / 3, i],
                [(2 * this.app.screen.width) / 3, i],
                [this.app.screen.width, i],
            )
        }
        
    }

    createLine(p0, p1, p2, p3) {
        const bezier = new PIXI.Graphics();

        bezier.x = 0;
        bezier.y = 0;
        bezier.alpha = 0.01;

        bezier.moveTo(p0[0], p0[1]);

        bezier.bezierCurveTo(
            p1[0], p1[1],
            p2[0], p2[1],
            p3[0], p3[1]
        );

        bezier.stroke({ width: 1, color: '0x82cbff' });

        this.app.stage.addChild(bezier);
    }
 }