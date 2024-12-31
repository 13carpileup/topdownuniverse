import { constants } from "../constants.js";
import { Slider } from "./UI.js"

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

        this.asteroid = false;

        this.trailLines = [];

        this.app = app;

        this.zoom = 1;

        this.sliderBool = 0;
        this.tooltip = 'null';
    }

    updateTrail(gameTime) {
        if (this.dragging) {
            this.trailing = false;
            return;
        }

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

            let add = 0;
            if (this.trailing) {
                let dist = Math.sqrt((this.lastTrailPos[0] - this.x) ** 2 + (this.lastTrailPos[1] - this.y) ** 2);
                add -= dist / constants.trailOn;
            }

            let newAlpha = ((i - start + n - 1) % n + add) / n;

            this.drawTrail([line.from[0] + local[0], line.from[1] + local[1]], [line.to[0] + local[0], line.to[1] + local[1]], newAlpha)
        }

        if (this.trailing && !this.dragging) {
            this.drawTrail([this.lastTrailPos[0] + local[0], this.lastTrailPos[1] + local[1]], [this.x + local[0], this.y + local[1]], 1)
        }
    }

    drawTrail(start, end, alpha) {
        let newLine = new PIXI.Graphics();

        newLine.moveTo(start[0] * this.zoom, start[1] * this.zoom);
        newLine.lineTo(end[0] * this.zoom, end[1] * this.zoom);
        newLine.stroke({width: 3, color: 0xDDDDDD});
        newLine.alpha = alpha;

        newLine.zIndex = -1;

        this.app.stage.addChild(newLine);
        this.trailLines.push(newLine);
    }

    destroy() {
        this.ref.destroy();

        if (this.tooltip != 'null') {
            this.tooltip.destroy();
        }

        this.trailLines.forEach((trail) => {
            trail.destroy();
        })
    }

    checkCollision(object) {
        let collisionReq = (this.radius + object.radius);
        let dist = (Math.sqrt((object.x - this.x) ** 2 + (object.y - this.y) ** 2));
        
        return collisionReq >= dist;
    }

    createSlider() {
        this.tooltip = new Slider(this.app, {
            x: 50,
            y: 100,
            width: 150,
            min: 0,
            max: 10000,
            value: Math.sqrt(this.vx ** 2 + this.vy ** 2),
            div:  100,
            onChange: (value) => {
                console.log(value, this.vx, this.vy, this.angle);
                if (Math.abs(value) < 0.1 || (this.vx / value) > 1) {
                    this.vx = 0;
                    this.vy = 0;

                    return;
                }

                console.log("PRECOMP",this.vx / value)

                this.angle = Math.acos(this.vx / value);

                this.vx = Math.cos(this.angle) * value;
                this.vy = Math.sin(this.angle) * value;

                
            },
            description: "Velocity"
        });
    }

    // ui
    toggleSlider() {
        if (this.slider) {
            this.slider = 0;
            this.tooltip.destroy();

            return;
        }

        this.createSlider();
        this.slider = 1;
    }

    update() {
        if (this.tooltip != 'null') {
            this.tooltip.updateValue(Math.sqrt(this.vx ** 2 + this.vy ** 2))
        }
    }

}