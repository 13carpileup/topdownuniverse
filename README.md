# Top Down Universe

A web-based universe simulator based on Newton's law of universal gravitation.

## Controls

- Click and drag the background to move your view around the 'universe'. 
- Click and drag on any object to move it; use the tooltip to adjust its velocity and angle.
- Use the controls at the bottom to create a new object, which will follow your mouse until you click.
- Double click an object to start following it.
- Zoom and pan to move around.

## Tech

All computations are done client-side (apologies laptop users, this might heat up your system...). The graphics of the universe are rendered with PixiJS, a 2D WebGL renderer. Other than that, the site is created in raw JavaScript (unfortunately).

## Exporting / Importing

You can export your planet's data to save it or to show off your creations. You can then import your own or other's data. You can do this in the settings menu. This data is stored in JSON in the following format (feel free to break the simulation by setting massive masses & radii):

```
{
    local: [float, float],
    zoom: float,
    objects: [
        {
            x: float,
            y: float,
            mass: int,
            radius: int,
            velocity: float,
            angle: float [domain of -pi to pi],
        }, ...
    ]
}
```

Try importing this 3-body configuration!

```
{"local":[341.73378139206926,-396.16178565241444],"zoom":0.9999999999999999,"objects":[{"x":534.2995882738663,"y":1019.9001732963161,"mass":10,"radius":10,"velocity":8.239176915722679,"angle":-2.821244470410738},{"x":702.682200249049,"y":840.3429085489838,"mass":5888,"radius":10,"velocity":8.106026962550924,"angle":1.2037091136949072},{"x":564.9883484099299,"y":852.7551535800783,"mass":25119,"radius":10,"velocity":1.3354533667339277,"angle":-1.360395992416571}]}
```

If you create something cool, please share it with me!
