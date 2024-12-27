import { Object } from './structs/Object.js'
import { Universe } from './structs/Universe.js';
import { Slider, Button } from './structs/UI.js';
import { showControlsPopup, createControlsPopup, handleResize } from './util.js';

// controls on first visit
const hasVisited = localStorage.getItem('hasVisitedBefore');
if (!hasVisited) {
    setTimeout(() => {
        showControlsPopup();
        localStorage.setItem('hasVisitedBefore', 'true');
    }, 500);
}

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
let newObject = {mass: 10, radius: 10};

// async IIFE
// essentially just immediately defines then calls an async function; one time use?
(async () =>
{
    const app = new PIXI.Application();

    await app.init({ background: '#000000', resizeTo: window });

    // initialize the UNIVERSE!

    let uni = new Universe(app);
    
    // app
    uni.addObject(app.screen.width / 2, app.screen.height / 2 - 300, 20, 3, 0, 20);
    uni.addObject(app.screen.width / 2, app.screen.height / 2, 50, 0, 0, 7000);

    sliders.push(new Slider(app, {
        x: 50,
        y: app.screen.height - 100,
        width: 150,
        min: 0,
        max: 100,
        value: 10,
        div:  10,
        onChange: (value) => {
            gravityAmp = value;
        },
        description: "Simulation Speed: "
    }));

    sliders.push(new Slider(app, {
        x: 250,
        y: app.screen.height - 100,
        width: 150,
        min: 1,
        max: 50,
        value: 10,
        div:  1,
        onChange: (value) => {
            newObject.radius = value;
        },
        description: "New Object Radius: "
    }));

    sliders.push(new Slider(app, {
        x: 450,
        y: app.screen.height - 100,
        width: 150,
        min: 1,
        max: 500,
        value: 1,
        div:  100,
        log: true,
        onChange: (value) => {
            newObject.mass = value;
        },
        description: "New Object Mass: "
    }));
    
    let buttons = []

    const b1 = new Button(app,
        {
            x: 650,
            y: app.screen.height - 100,
            width: 150,
            height: 50,
            description: "Create Object",
            onClick: () => {
                uni.addObject(20 - local[0], 20 - local[1], newObject.radius, 0, 0, newObject.mass, true);
            }
        }
    )

    buttons.push(b1);

    let grid = 1

    const b2 = new Button(app,
        {
            x: buttons[buttons.length - 1].options.x + buttons[buttons.length - 1].options.width + 30,
            y: app.screen.height - 100,
            width: 130,
            height: 50,
            description: "Toggle Grid",
            onClick: () => {
                grid = !grid;
            }
        }
    )

    buttons.push(b2);

    const helpButton = new Button(app, {
        x: buttons[buttons.length - 1].options.x + buttons[buttons.length - 1].options.width + 30,
        y: app.screen.height - 100,
        width: 100,
        height: 50,
        description: "Controls",
        onClick: () => {
            showControlsPopup();
        }
    });

    buttons.push(helpButton);

    

    window.addEventListener('resize', () => handleResize(app, sliders, buttons));

    // boilerplate
    document.body.appendChild(app.canvas);
    app.ticker.add((time) =>
    {
        dragTarget = uni.updateObjects(time.deltaTime * gravityAmp / 3, local, grid);
    });
})();