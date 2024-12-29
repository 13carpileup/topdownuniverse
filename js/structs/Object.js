import { constants } from "../constants.js";

export class Object {
    constructor(ref, radius, x, y, velocity, angle, mass) {
        this.ref = ref;
        this.radius = radius;
        this.x = x;
        this.y = y;

        this.velocity = velocity;
        this.angle = angle;

        this.vx = Math.cos(angle) * velocity;
        this.vy = Math.sin(angle) * velocity;

        this.mass = mass;
        this.fx = 0;
        this.fy = 0;

        this.dragging = 0;
        this.lastDragTime = 0;
        this.lastPos = [0, 0];

        this.lastClick = 0;

        this.trails = [];
        this.lastTrailPos = [this.x, this.y];
        this.trailing = true;
        this.accumulated = 0;

        this.trailLines = [];
    }

    updateTrail(gameTime) {
        this.accumulated += gameTime;

        if (this.trailing && this.accumulated >= constants.trailOn) {
            this.trails.push([this.lastTrailPos, [this.x, this.y]]);
            this.trailing = false;

            this.accumulated %= constants.trailOn;
        }

        else if (!this.trailing && this.accumulated >= constants.trailOff) {
            this.lastTrailPos = [this.x, this.y];
            this.trailing = true;

            this.accumulated %= constants.trailOff;
        }

        if (this.trails.length > 10) {
            this.trails.shift();
        }
    }

    drawTrails(app, local) {
        this.trailLines.forEach((line) => {
            line.destroy();
        })

        this.trailLines = [];

        this.trails.forEach((line) => {
            let newLine = new PIXI.Graphics();
            newLine.alpha = 0.7;
            app.stage.addChild(newLine);

            newLine.moveTo(line[0][0] + local[0], line[0][1] + local[1]);
            newLine.lineTo(line[1][0] + local[0], line[1][1] + local[1]);
            newLine.stroke({width: 3, color: 0xDDDDDD});

            this.trailLines.push(newLine);
        })
    }

    checkCollision(object) {
        let collisionReq = (this.radius + object.radius);
        let dist = (Math.sqrt((object.ref.x - this.ref.x) ** 2 + (object.ref.y - this.ref.y) ** 2));
        
        return collisionReq >= dist;
    }
}