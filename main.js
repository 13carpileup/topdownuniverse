
// async IIFE
// essentially just immediately defines then calls an async function; one time use?
(async () =>
{
    const app = new PIXI.Application();

    await app.init({ background: '#6a6a6a', resizeTo: window });

    console.log(window.innerHeight, window.innerWidth)

    const gr  = new PIXI.Graphics();
    gr.beginFill(0xffffff);
    gr.drawCircle(30, 30, 30);
    gr.endFill();

    //gr.anchor.set(0.5) // anchors centre the sprite to the middle of the object! (though i guess not for graphics)
    gr.x = app.screen.width / 2;
    gr.y = app.screen.height / 2;
    app.stage.addChild(gr);

    document.body.appendChild(app.canvas);

    app.ticker.add((time) =>
    {
        gr.x += (1) * time.deltaTime;
        console.log(time.deltaTime);
    });
})();