import { Object } from "./Object.js";
import { Spacetime } from "./Spacetime.js";

export class Universe {
    constructor(app) {
        this.Objects = [];
        this.Spacetime = new Spacetime(app);
        this.app = app;

        this.dragTarget = null;

        this.app.stage.eventMode = 'static';
        this.app.stage.hitArea = this.app.screen;

        this.onDragMove = this.onDragMove.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);

        this.app.stage.on('pointerup', this.onDragEnd);
        this.app.stage.on('pointerupoutside', this.onDragEnd);
    }

    onDragMove(event) {
        if (this.dragTarget) {
            this.dragTarget.ref.parent.toLocal(event.global, null, this.dragTarget.position);
            let delta = [event.x - this.dragTarget.ref.x, event.y - this.dragTarget.ref.y];

            this.dragTarget.ref.x += delta[0];
            this.dragTarget.ref.y += delta[1];

            this.dragTarget.x += delta[0];
            this.dragTarget.y += delta[1];

            let deltaTime = Date.now() - this.dragTarget.lastDragTime;
            
            if (deltaTime >= 100) {
                this.dragTarget.vx = (event.x - this.dragTarget.lastPos[0]) / deltaTime * 10; 
                this.dragTarget.vy = (event.y - this.dragTarget.lastPos[1]) / deltaTime * 10; 

                this.dragTarget.lastDragTime = Date.now();
                this.dragTarget.lastPos = [event.x, event.y];
            }
            console.log(event.x, event.y);
        }
    }

    onDragStart(object) {
        console.log("DRAG START!");
        this.dragTarget = object;
        this.app.stage.on('pointermove', this.onDragMove);
        object.dragging = 1;
    }

    onDragEnd() {
        if (this.dragTarget) {
            this.app.stage.off('pointermove', this.onDragMove);
            this.dragTarget.dragging = 0;
            this.dragTarget = null;
        }
    }


    addObject(x, y, radius, velocity, angle, mass) {
        const gr  = new PIXI.Graphics();
        gr.beginFill(0xffffff);
        gr.drawCircle(0, 0, radius);
        gr.endFill();
    
        //gr.anchor.set(0.5) // anchors centre the sprite to the middle of the object! (though i guess not for graphics)
        gr.eventMode = 'static';
        gr.cursor = 'pointer';

        gr.x = x - radius;
        gr.y = y - radius;
        this.app.stage.addChild(gr);

        let newObject = new Object(gr, radius, x, y, velocity, angle, mass);
        newObject.ref.on('pointerdown', () => this.onDragStart(newObject)); // janky ass js code
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
                    //console.log("COLLISION!")
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
            if (object.dragging) return;

            object.vx += (object.fx / object.mass) * gameTime;
            object.vy += (object.fy / object.mass) * gameTime;

            object.x += (object.vx) * (gameTime);
            object.y += (object.vy) * (gameTime);

            object.ref.x = object.x + local[0];
            object.ref.y = object.y + local[1];
        });

        this.Spacetime.update(this.Objects, local);

        return this.dragTarget;
    }
}