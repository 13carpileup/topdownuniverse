export class Spacetime {
    constructor(app) {
        this.app = app;
        this.curves = [];
        this.density = 40; // smaller = more accurate
    }

    update(objects, local) {
        this.curves.forEach((curve) => {
            curve.destroy();
        })


        this.curves = []
        
        this.drawLines(local[0] % this.density, this.density, local[1] % this.density, this.density, objects);
   
        
    }

    drawLines(xBegin, xDelta, yBegin, yDelta, objects, rev = 0) {
        let allPoints = []
        for (let x = xBegin; x < this.app.screen.width; x += xDelta) {
            let points = []

            for (let y = yBegin; y < this.app.screen.height; y += yDelta) {
                let forces = [0, 0];

                objects.forEach((object) => {
                    let dx = x - object.ref.x;
                    let dy = y - object.ref.y;

                    let distSquared = Math.max(dx ** 2 + dy ** 2, 0.001);
                    let force = (object.mass * 300) / distSquared;

                    let deltaForces = [dx / distSquared * force, dy / distSquared * force];

                    if (Math.abs(deltaForces[0]) > Math.abs(dx)) deltaForces[0] = dx;
                    if (Math.abs(deltaForces[1]) > Math.abs(dy)) deltaForces[1] = dy;
                    
                    forces[0] += deltaForces[0];
                    forces[1] += deltaForces[1];
                }) 
                
                
                let transformed = [x - forces[0], y - forces[1]];
                points.push(transformed);
            }

            allPoints.push(points);
        }

        for (let i = 0; i < allPoints.length; i++) {
            for (let j = 0; j < allPoints[i].length; j++) {
                if (j!=0) this.drawSingleLine(allPoints[i][j-1], allPoints[i][j]);
                if (i!=0) this.drawSingleLine(allPoints[i-1][j], allPoints[i][j]);
            }
        }
    }

    drawSingleLine(start, end) {
        let line = new PIXI.Graphics();
        

        line.position.set(start[0], start[1]);

        line.moveTo(0, 0)
        line.lineTo(end[0] - start[0], end[1] - start[1]);
        line.stroke({ width: 1, color: '0x82cbff' });
        line.alpha = 0.2;
        
        this.curves.push(line);
        this.app.stage.addChild(line);
    }
 }