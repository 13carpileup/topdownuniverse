import { Object } from './structs/Object.js'
import { Universe } from './structs/Universe.js';
import { Slider } from './structs/UI.js';

let mouseDown = false;
let local = [0, 0]
let last = [0, 0]
let dragTarget = null;


document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('mousedown', (event) => {
        mouseDown = true;
        last = [event.clientX, event.clientY]
    });

    document.addEventListener('mouseup', (event) => {
        mouseDown = false;
    });

    document.addEventListener('mousemove', (event) => {
        let flag = 0;

        sliders.forEach((slider) => {
            if (slider.isDragging) {
                flag = 1;
                return;
            }
        })

        if (!mouseDown || dragTarget!=null || flag) return;
        
        local = [local[0] + event.clientX - last[0], local[1] + event.clientY - last[1]];
        last = [event.clientX, event.clientY];
    }); 
});

let gravityAmp = 1;
let sliders = [];
// async IIFE
// essentially just immediately defines then calls an async function; one time use?
(async () =>
{
    const app = new PIXI.Application();

    await app.init({ background: '#000000', resizeTo: window });

    // initialize the UNIVERSE!

    let uni = new Universe(app);
    
    // app
    uni.addObject(app.screen.width / 2, app.screen.height / 2 - 400, 20, 1, 0, 10);
    uni.addObject(app.screen.width / 2, app.screen.height / 2, 100, 0, 0, 4000);

    sliders.push(new Slider(app, {
        x: 50,
        y: app.screen.height - 100,
        width: 300,
        min: 0,
        max: 100,
        value: 10,
        div:  10,
        onChange: (value) => {
            gravityAmp = value / 10;
            console.log(`Slider value changed: ${value}`);
        },
        description: "Simulation Speed: "
    }));

    // boilerplate
    document.body.appendChild(app.canvas);

    app.ticker.add((time) =>
    {
        dragTarget = uni.updateObjects(time.deltaTime * gravityAmp, local);
    });
})();