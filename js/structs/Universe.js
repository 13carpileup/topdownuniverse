import { Object } from "./Object.js";

export class Universe {
    constructor() {
        this.Objects = [];
    }

    addObject(app, x, y, radius, velocity, angle) {
        const gr  = new PIXI.Graphics();
        gr.beginFill(0xffffff);
        gr.drawCircle(0, 0, radius);
        gr.endFill();
    
        //gr.anchor.set(0.5) // anchors centre the sprite to the middle of the object! (though i guess not for graphics)
        gr.x = x;
        gr.y = y;
        app.stage.addChild(gr);

        let newObject = new Object(gr, radius, velocity, angle);
        this.Objects.push(newObject);
    }

    updateObjects(gameTime) {
        this.Objects.forEach((object) => {
            object.ref.x += (Math.cos(object.angle)) * (object.velocity) * (gameTime);
            object.ref.y += (Math.sin(object.angle)) * (object.velocity) * (gameTime);
        })
    }
}