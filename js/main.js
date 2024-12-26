import { Object } from './structs/Object.js'
import { Universe } from './structs/Universe.js';

let mouseDown = false;
let local = [0, 0]
let last = [0, 0]


document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('mousedown', (event) => {
        mouseDown = true;
        last = [event.clientX, event.clientY]
    });

    document.addEventListener('mouseup', (event) => {
        mouseDown = false;
    });

    document.addEventListener('mousemove', (event) => {
        if (!mouseDown) return;
        
        local = [local[0] + event.clientX - last[0], local[1] + event.clientY - last[1]];
        last = [event.clientX, event.clientY];
    }); 
});


// async IIFE
// essentially just immediately defines then calls an async function; one time use?
(async () =>
{
    const app = new PIXI.Application();

    await app.init({ background: '#000000', resizeTo: window });

    // initialize the UNIVERSE!

    let uni = new Universe(app);
    
    uni.addObject(app, 300, 300, 10, 2, 1, 100);
    uni.addObject(app, 400, 850, 20, 0, 0, 30000);
    uni.addObject(app, app.screen.width - 100, app.screen.height - 100, 10, 0, 0, 300);

    // boilerplate
    document.body.appendChild(app.canvas);

    app.ticker.add((time) =>
    {
        uni.updateObjects(time.deltaTime, local);
    });
})();