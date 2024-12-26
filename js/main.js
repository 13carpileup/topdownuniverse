import { Object } from './structs/Object.js'
import { Universe } from './structs/Universe.js';




// async IIFE
// essentially just immediately defines then calls an async function; one time use?
(async () =>
{
    const app = new PIXI.Application();

    await app.init({ background: '#6a6a6a', resizeTo: window });

    // initialize the UNIVERSE!

    let uni = new Universe();
    uni.addObject(app, 100, 100, 10, 0.05, 0, 40);
    //uni.addObject(app, 400, 650, 10, 2, 0, 10);
    uni.addObject(app, app.screen.width - 100, app.screen.height - 100, 10, 0, 0, 10);


    // boilerplate
    document.body.appendChild(app.canvas);

    app.ticker.add((time) =>
    {
        uni.updateObjects(time.deltaTime);
    });
})();