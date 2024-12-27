import { Object } from "./Object.js";
import { Spacetime } from "./Spacetime.js";

export class Universe {
    constructor(app) {
        this.Spacetime = new Spacetime(app);

        this.Objects = [];
        this.app = app;

        this.dragTarget = null;

        this.app.stage.eventMode = 'static';
        this.app.stage.hitArea = this.app.screen;

        this.onDragMove = this.onDragMove.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);

        this.app.stage.on('pointerup', this.onDragEnd);
        this.app.stage.on('pointerupoutside', this.onDragEnd);

        this.GravAmplification = (1 / 2);
        this.FlingAmplification = (12);

        this.buttonPressed = false;

        this.local = [0, 0];

        this.target = false;

        this.tooltip = null;
    }


    

    onDragMove(event) {
        if (this.dragTarget) {
            this.dragTarget.ref.x = event.x;
            this.dragTarget.ref.y = event.y;
            this.dragTarget.x = event.x - this.local[0]; 
            this.dragTarget.y = event.y - this.local[1];

            let deltaTime = Date.now() - this.dragTarget.lastDragTime;
            deltaTime = Math.max(deltaTime, 1);
            
            this.dragTarget.vx = (event.x - this.dragTarget.lastPos[0]) / deltaTime * this.FlingAmplification;
            this.dragTarget.vy = (event.y - this.dragTarget.lastPos[1]) / deltaTime * this.FlingAmplification; 

            this.dragTarget.lastDragTime = Date.now();
            this.dragTarget.lastPos = [event.x, event.y];
        }
    }

    onDragStart(object) {
        this.dragTarget = object;
        this.app.stage.on('pointermove', this.onDragMove);
        object.dragging = 1;
    }

    onDragEnd() {
        if (this.dragTarget && (!this.buttonPressed || (Date.now() - this.buttonPressed) > 200)) {
            this.app.stage.off('pointermove', this.onDragMove);
            this.dragTarget.dragging = 0;
            this.dragTarget = null;

            this.buttonPressed = false;
        }
    }


    addObject(x, y, radius, velocity, angle, mass) {
        const gr = new PIXI.Graphics();
        gr.beginFill(0xffffff);
        gr.drawCircle(0, 0, radius);
        gr.endFill();
    
        gr.eventMode = 'static';
        gr.cursor = 'pointer';
    
        gr.x = x - radius;
        gr.y = y - radius;
        this.app.stage.addChild(gr);
    
        let newObject = new Object(gr, radius, x, y, velocity, angle, mass);
        
        newObject.ref.on('pointerdown', (event) => {
            if ((Date.now() - newObject.lastClick) < 300) {
                if (this.target == newObject) this.target = false;
                else this.target = newObject;
            }
            newObject.lastClick = Date.now();
            this.onDragStart(newObject);
        });

        this.Objects.push(newObject);
    }

    updateObjects(gameTime, local, grid) {
        this.local = local;

        if (grid) this.Spacetime.update(this.Objects, local);
        else this.Spacetime.clear();

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
                        const newVx = (object1.vx * object1.mass + object2.vx * object2.mass) / (object1.mass + object2.mass);
                        const newVy = (object1.vy * object1.mass + object2.vy * object2.mass) / (object1.mass + object2.mass);
                        
                        if (!isNaN(newVx) && !isNaN(newVy)) {
                            object1.vx = newVx;
                            object1.vy = newVy;
                            object1.mass += object2.mass;
                        }


                        // object1.vx = (object1.vx * object1.mass + object2.vx * object2.mass) / (object1.mass + object2.mass);
                        // object1.vy = (object1.vy * object1.mass + object2.vy * object2.mass) / (object1.mass + object2.mass);

                        // object1.mass += object2.mass;
                        
                        //todo: collision splits
                        //this.addObject(object2.x + object2.radius + 10, object2.y + object2.radius + 10, object2.radius / 4, object1.velocity, -object1.angle, object2.mass / 4);

                        object2.ref.destroy();
                        this.Objects.splice(this.Objects.indexOf(object2), 1);
                    }

                    return;
                }

                let Dx = (object2.x - object1.x);
                let Dy = (object2.y - object1.y);

                let distSquared = Dx ** 2 + Dy ** 2;
                let force = (object1.mass * object2.mass) / distSquared * this.GravAmplification;

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

        if (this.target) {
            local = [this.app.screen.width / 2 - this.target.x, this.app.screen.height / 2 - this.target.y];
        }

        return {dragTarget: this.dragTarget, local: local};
    }
}