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
        this.state = 1;
        this.trailTimes = [constants.trailOn, constants.trailOff] // 0 - trail on, 1 - trail off
        this.last = 0;
    }

    // updateTrail(gameTime) {
    //     if 
    // }

    checkCollision(object) {
        let collisionReq = (this.radius + object.radius);
        let dist = (Math.sqrt((object.ref.x - this.ref.x) ** 2 + (object.ref.y - this.ref.y) ** 2));
        
        return collisionReq >= dist;
    }
}