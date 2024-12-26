export class Object {
    constructor(ref, radius, vx, vy, mass) {
        this.ref = ref;
        this.radius = radius;
        this.vx = vx;
        this.vy = vy;
        this.mass = mass;
        this.fx = 0;
        this.fy = 0;
    }

    checkCollision(object) {
        let collisionReq = (this.radius + object.radius);
        let dist = (Math.sqrt((object.ref.x - this.ref.x) ** 2 + (object.ref.y - this.ref.y) ** 2));
        console.log(collisionReq, dist);
        return collisionReq >= dist;
    }
}