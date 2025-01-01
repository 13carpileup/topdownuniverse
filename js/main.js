import { Object } from './structs/Object.js'
import { Universe } from './structs/Universe.js';
import { Slider, Button } from './structs/UI.js';
import { showControlsPopup, createControlsPopup, handleResize } from './util.js';
import { constants } from './constants.js';
import { Settings } from './structs/Settings.js';

// controls on first visit
const hasVisited = localStorage.getItem('hasVisitedBefore');
if (!hasVisited) {
    setTimeout(() => {
        showControlsPopup();
        localStorage.setItem('hasVisitedBefore', 'true');
    }, 500);
}

// globals
let mouseDown = false;
let local = [0, 0]
let last = [0, 0]
let dragTarget = null;
let zoom = 1;
let tooltipDragging = false;
let settings;
let pause = 1;

document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('mousedown', (event) => {
        mouseDown = true;
        last = [event.clientX, event.clientY]
    });

    document.addEventListener('mouseup', (event) => {
        mouseDown = false;
    });

    document.addEventListener('mousemove', (event) => {
        let flag = tooltipDragging;

        sliders.forEach((slider) => {
            if (slider.isDragging) {
                flag = 1;
                return;
            }
        });

        settings.sliders.forEach((slider) => {
            if (slider.isDragging) {
                flag = 1;
                return;
            }
        })

        if (!mouseDown || dragTarget!=null || flag) return;
        
        local = [local[0] + (event.clientX - last[0]) / zoom, local[1] + (event.clientY - last[1]) / zoom];
        last = [event.clientX, event.clientY];
    }); 
});


function handleWheel(event, app) {
    console.log(event.x, event.y);
    const scrollDirection = Math.sign(event.deltaY);
    const zoomStep = constants.scrollSpeed; 

    if (scrollDirection < 0) {
        zoom += zoomStep;
    }

    else if (scrollDirection > 0) {
        if (zoom == 0.3) return;
        zoom = Math.max(zoom - zoomStep, 0.3); 
    }

    const newWidth = app.screen.width / zoom;
    const newHeight = app.screen.height / zoom;

    const middle = [- event.x + newWidth / 2, - event.y + newHeight / 2];

    const weightedx = (local[0] * 29 + middle[0]) / 30;
    const weightedy = (local[1] * 29 + middle[1]) / 30;

    local = [weightedx, weightedy];
};

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

    settings = new Settings(app);
    let uni = new Universe(app);
    app.stage.on('wheel', (() => {handleWheel(event, app)}).bind(this));
    
    // app
    uni.addObject(app.screen.width / 2, app.screen.height / 2 - 300, 20, 4.08, 0, 1);
    uni.addObject(app.screen.width / 2, app.screen.height / 2, 130, 0, 0, 10000);

    sliders.push(new Slider(app, {
        x: 250,
        y: app.screen.height - 100,
        width: 150,
        min: 1,
        max: 200,
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

    const b0 = new Button(app,
        {
            x: 50,
            y: app.screen.height - 100,
            width: 150,
            height: 50,
            description: "Pause",
            descriptionToggle: "Unpause",
            onClick: () => {
                pause = !pause;
            }
        }
    )

    buttons.push(b0);

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

    const b2 = new Button(app, {
        x: buttons[buttons.length - 1].options.x + buttons[buttons.length - 1].options.width + 30,
        y: app.screen.height - 100,
        width: 130,
        height: 50,
        description: "Settings",
        onClick: () => {
            settings.toggle();
        }
    });

    window.addEventListener('resize', () => {
        handleResize(app, sliders, buttons);
        settings.handleResize();
    });

    window.gravityAmp = 1;
    window.grid = false;
    window.trails = true;

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
        let returnObject = uni.updateObjects(time.deltaTime * window.gravityAmp * (1 / 6) * pause, local, zoom);
        dragTarget = returnObject.dragTarget;
        local = returnObject.local;
        tooltipDragging = returnObject.tooltipDragging;

    });
})();