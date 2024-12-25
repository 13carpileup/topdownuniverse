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
    uni.addObject(app, app.screen.width / 2, app.screen.height / 2, 30, 0.5, 0);
    uni.addObject(app, app.screen.width / 2, app.screen.height / 2, 30, 0.5, 2);


    // boilerplate
    document.body.appendChild(app.canvas);

    app.ticker.add((time) =>
    {
        uni.updateObjects(time.deltaTime);
    });
})();