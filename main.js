
// async IIFE
// essentially just immediately defines then calls an async function; one time use?
(async () =>
{
    const app = new PIXI.Application();

    await app.init({ background: '#6a6a6a', resizeTo: window });
    const texture = await Assets.load('https://pixijs.com/assets/bunny.png');

    document.body.appendChild(app.canvas);
})();