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
        this.trails[0] = {"from":[this.x, this.y], "to":[this.x, this.y]};
        this.lastTrailPos = [this.x, this.y];
        this.trailing = true;
        this.tIndex = 1;

        this.trailLines = [];

        this.app = app;
    }

    updateTrail(gameTime) {
        console.log(this.tIndex);

        let n = constants.trailLength;
        let dIndex = (this.tIndex - 1 + n) % n;
        let fromDist = Math.sqrt((this.trails[dIndex].to[0] - this.x) ** 2 + (this.trails[dIndex].to[1] - this.y) ** 2); 
        let toDist = Math.sqrt((this.lastTrailPos[0] - this.x) ** 2 + (this.lastTrailPos[1] - this.y) ** 2); 

        if (this.trailing && toDist >= constants.trailOn) {
            this.trails[this.tIndex] = {"from":this.lastTrailPos, "to":[this.x, this.y]};
            
            this.tIndex += 1;
            this.tIndex %= n;

            this.trailing = false;
        }

        else if (!this.trailing && fromDist >= constants.trailOff) {
            this.trailing = true;

            this.lastTrailPos = [this.x, this.y];
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

        if (this.trailing) {

            let newLine = new PIXI.Graphics();

            newLine.moveTo(this.lastTrailPos[0] + local[0], this.lastTrailPos[1] + local[1]);
            newLine.lineTo(this.x + local[0], this.y + local[1]);
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