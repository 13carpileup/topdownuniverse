export class Spacetime {
    constructor(app) {
        this.app = app;
        this.curves = [];
        this.dif = 50;
    }

    update(objects, local) {
        this.curves.forEach((curve) => {
            curve.destroy();
        })

        this.curves = []

        for (let i = local[0] % this.dif - 200; i < this.app.screen.width + 200; i += this.dif) {
            let c = [i, this.app.screen.height / 2]; 

            this.createLine(
                [i, 0],
                this.getControlPoint(c, objects),
                [i, this.app.screen.height],
            )
        }

        for (let i = local[1] % this.dif - 200; i < this.app.screen.height + 200; i += this.dif) {
            let c = [i, this.app.screen.width / 2]; 

            this.createLine(
                [0, i],
                this.getControlPoint(c, objects, 1).reverse(),
                [this.app.screen.width, i],
            )
        }
        
    }

    getControlPoint(base, objects, rev=0) {
        let c = [...base];

        objects.forEach((object) => {
            let d1 = [object.ref.x, object.ref.y];
            if (rev) d1.reverse();
            let dist = [d1[0] - base[0], d1[1] - base[1]]; 

            if (dist[0]==0||dist[1]==0) return c;
            
            if (Math.abs(dist[0]) < 20) dist[0] = 20 * dist[0] / Math.abs(dist[0]);
            if (Math.abs(dist[1]) < 20) dist[1] = 20 * dist[1] / Math.abs(dist[1]);

            let factor = (object.mass) * (1 / (dist[0] ** 2)) * 3;
            factor = Math.min(factor, 1.4);

            c[0] += dist[0] * factor;
            c[1] += dist[1] * factor;
        }) 

        return c
    }

    createLine(p0, p1, p2) {
        const bezier = new PIXI.Graphics();

        bezier.x = 0;
        bezier.y = 0;
        bezier.alpha = 0.15;

        bezier.moveTo(p0[0], p0[1]);

        bezier.quadraticCurveTo(
            p1[0], p1[1],
            p2[0], p2[1]
        );

        bezier.stroke({ width: 1, color: '0x82cbff' });

        this.curves.push(bezier);

        this.app.stage.addChild(bezier);
    }
 }