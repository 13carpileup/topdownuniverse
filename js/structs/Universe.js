import { Object } from "./Object.js";

export class Universe {
    constructor() {
        this.Objects = [];
    }

    addObject(app, x, y, radius, velocity, angle, mass) {
        const gr  = new PIXI.Graphics();
        gr.beginFill(0xffffff);
        gr.drawCircle(0, 0, radius);
        gr.endFill();
    
        //gr.anchor.set(0.5) // anchors centre the sprite to the middle of the object! (though i guess not for graphics)
        gr.x = x;
        gr.y = y;
        gr.x = x - radius;
        gr.y = y - radius;
        app.stage.addChild(gr);

        let newObject = new Object(gr, radius, velocity, angle, mass);
        this.Objects.push(newObject);
    }

    updateObjects(gameTime) {
        // reset forces
        this.Objects.forEach((object) => {
            object.fx = 0;
            object.fy = 0;
        })

        // update forces, check collisions
        this.Objects.forEach((object1) => {
            this.Objects.forEach((object2) => {
                if (object1 == object2) return;

                if (object1.checkCollision(object2)) {
                    console.log("COLLISION!")
                    if (object1.mass >= object2.mass) {
                        object1.mass += object2.mass;
                        //conservation of forces?
                        object1.vx += object2.vx;
                        object1.vy += object2.vy;

                        object2.ref.destroy();
                        this.Objects.splice(this.Objects.indexOf(object2));
                    }

                    return;
                }

                let Dx = (object2.ref.x - object1.ref.x);
                let Dy = (object2.ref.y - object1.ref.y);

                let distSquared = Dx ** 2 + Dy ** 2;
                let force = (object1.mass * object2.mass) / distSquared * 5;

                let theta = Math.atan2(Dy, Dx);

                let dist = Math.abs(Dx) + Math.abs(Dy);

                object1.fx += (Dx / dist) * force; 
                object1.fy += (Dy / dist) * force; 

                

                // console.log("FORCES UPDATE", object1.fx, object1.fy);
            })
        })

        // update movements, velocities
        this.Objects.forEach((object) => {

            object.vx += object.fx * gameTime;
            object.vy += object.fy * gameTime;

            object.ref.x += (object.vx) * (gameTime);
            object.ref.y += (object.vy) * (gameTime);
        })
    }
}