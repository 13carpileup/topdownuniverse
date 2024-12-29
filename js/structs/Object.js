import { constants } from "../constants.js";

export class Object {
    constructor(ref, radius, x, y, velocity, angle, mass, app) {
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

        this.trails = new Array(constants.trailLength);
        this.lastTrailPos = [this.x, this.y];
        this.trailing = true;
        this.accumulated = 0;
        this.tIndex = 0;

        this.trailLines = [];

        this.app = app;
    }

    updateTrail(gameTime) {
        this.accumulated += gameTime;

        if (this.trailing && this.accumulated >= constants.trailOn) {
            this.trails[this.tIndex] = {"from":this.lastTrailPos, "to":[this.x, this.y]};
            this.trailing = false;

            this.accumulated %= constants.trailOn;

            this.tIndex += 1;
            this.tIndex %= constants.trailLength;
        }

        else if (!this.trailing && this.accumulated >= constants.trailOff) {
            this.lastTrailPos = [this.x, this.y];
            this.trailing = true;

            this.accumulated %= constants.trailOff;
        }
    }

    drawTrails(local) {
        this.trailLines.forEach((line) => {
            line.destroy();
        })

        this.trailLines = []

        let n = constants.trailLength;

        const start = (this.tIndex == 0) ? (n - 1) : this.tIndex - 1;

        for (let i = start; i < (start + n); i++) {
            let line = this.trails[i % n];

            if (!line) continue;

            let newLine = new PIXI.Graphics();


            newLine.alpha = ((i - start + n - 1) % n) / n;

            newLine.moveTo(line.from[0] + local[0], line.from[1] + local[1]);
            newLine.lineTo(line.to[0] + local[0], line.to[1] + local[1]);
            newLine.stroke({width: 3, color: 0xDDDDDD});

            this.app.stage.addChild(newLine);

            this.trailLines.push(newLine);
        }
    }

    destroy() {
        this.ref.destroy();

        this.trailLines.forEach((trail) => {
            trail.destroy();
        })
    }

    checkCollision(object) {
        let collisionReq = (this.radius + object.radius);
        let dist = (Math.sqrt((object.ref.x - this.ref.x) ** 2 + (object.ref.y - this.ref.y) ** 2));
        
        return collisionReq >= dist;
    }
}