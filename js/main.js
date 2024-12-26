import { Object } from './structs/Object.js'
import { Universe } from './structs/Universe.js';

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
        if (!mouseDown || dragTarget!=null) return;
        
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
    
    // app
    uni.addObject(app.screen.width / 2, app.screen.height / 2 - 400, 20, 1, 0, 10);
    uni.addObject(app.screen.width / 2, app.screen.height / 2, 100, 0, 0, 3000);

    // boilerplate
    document.body.appendChild(app.canvas);

    app.ticker.add((time) =>
    {
        dragTarget = uni.updateObjects(time.deltaTime, local);
    });
})();