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
}