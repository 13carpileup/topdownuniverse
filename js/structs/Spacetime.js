export class Spacetime {
    constructor(app) {
        this.app = app;
        this.density = 50; // smaller = more accurate
        this.notFirst = 0
        this.lines = new Map();
    }

    update(objects, local) {
        this.drawLines(local[0] % this.density - 100, this.density, local[1] % this.density - 100, this.density, objects);
    }

    drawLines(xBegin, xDelta, yBegin, yDelta, objects) {
        let allPoints = [];
        for (let x = xBegin; x < this.app.screen.width + 100; x += xDelta) {
            let points = [];

            for (let y = yBegin; y < this.app.screen.height + 100; y += yDelta) {
                let forces = [0, 0];

                objects.forEach((object) => {
                    let dx = x - object.ref.x;
                    let dy = y - object.ref.y;

                    let distSquared = Math.max(dx ** 2 + dy ** 2, 0.001);
                    let force = (object.mass * 1000) / distSquared;

                    let deltaForces = [dx / distSquared * force, dy / distSquared * force];

                    if (Math.abs(deltaForces[0]) > Math.abs(dx)) deltaForces[0] = dx;
                    if (Math.abs(deltaForces[1]) > Math.abs(dy)) deltaForces[1] = dy;

                    forces[0] += deltaForces[0];
                    forces[1] += deltaForces[1];
                });

                let transformed = [x - forces[0], y - forces[1]];
                points.push(transformed);
            }

            allPoints.push(points);
        }

        for (let i = 0; i < allPoints.length; i++) {
            for (let j = 0; j < allPoints[i].length; j++) {
                let line;

                if (j != 0) {
                    const key = `${i},${j-1},${i},${j}`;

                    if (!this.lines.has(key)) {
                        line = new PIXI.Graphics();
                        line.alpha = 0.2;
                        this.app.stage.addChild(line);

                        this.lines.set(key, line);
                    }
                    else {
                        line = this.lines.get(key);
                    }

                    this.drawSingleLine(line, allPoints[i][j - 1], allPoints[i][j]);
                }
                if (i != 0) {
                    const key = `${i-1},${j},${i},${j}`;

                    if (!this.lines.has(key)) {
                        console.log('no cache...')
                        line = new PIXI.Graphics();
                        line.alpha = 0.2;
                        this.app.stage.addChild(line);

                        this.lines.set(key, line);
                    }
                    else {
                        console.log('cached!')
                        line = this.lines.get(key);
                    }

                    this.drawSingleLine(line, allPoints[i - 1][j], allPoints[i][j]);
                }
            }
        }

        this.notFirst = 1;
    }

    drawSingleLine(line, start, end) {
        line.clear();
        line.moveTo(start[0], start[1]);
        line.lineTo(end[0], end[1]);
        line.stroke({width: 1, color: 0x82cbff});
    }
}