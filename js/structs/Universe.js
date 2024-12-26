import { Object } from "./Object.js";
import { Spacetime } from "./Spacetime.js";

export class Universe {
    constructor(app) {
        this.Objects = [];
        this.Spacetime = new Spacetime(app);
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

        let newObject = new Object(gr, radius, x, y, velocity, angle, mass);
        this.Objects.push(newObject);
    }

    updateObjects(gameTime, local) {
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
                        
                        
                        //conservation of momentum
                        object1.vx = (object1.vx * object1.mass + object2.vx * object2.mass) / (object1.mass + object2.mass);
                        object1.vy = (object1.vy * object1.mass + object2.vy * object2.mass) / (object1.mass + object2.mass);

                        object1.mass += object2.mass;

                        object2.ref.destroy();
                        this.Objects.splice(this.Objects.indexOf(object2), 1);
                    }

                    return;
                }

                let Dx = (object2.x - object1.x);
                let Dy = (object2.y - object1.y);

                let distSquared = Dx ** 2 + Dy ** 2;
                let force = (object1.mass * object2.mass) / distSquared * (1 / 5);

                let dist = Math.sqrt(distSquared);

                object1.fx += (Dx / dist) * force; 
                object1.fy += (Dy / dist) * force; 

                // console.log("FORCES UPDATE", object1.fx, object1.fy);
            })
        })

        // update movements, velocities
        this.Objects.forEach((object) => {
            object.vx += (object.fx / object.mass) * gameTime;
            object.vy += (object.fy / object.mass) * gameTime;

            object.x += (object.vx) * (gameTime);
            object.y += (object.vy) * (gameTime);

            object.ref.x = object.x + local[0];
            object.ref.y = object.y + local[1];
        });

        this.Spacetime.update(this.Objects);
    }
}