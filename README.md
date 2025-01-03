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
{"local":[-81.99252348884069,-379.39990640451373],"zoom":1.3499999999999992,"objects":[{"x":840.6530083923776,"y":627.3358257321563,"mass":50119,"radius":51,"velocity":0.02973302658853607,"angle":2.8311407312281367},{"x":-11677.21522961609,"y":35096.41053647322,"mass":64.8,"radius":9.2,"velocity":33.21104401882443,"angle":1.8487498582782682},{"x":579.6148895628289,"y":739.2543408881329,"mass":102,"radius":9,"velocity":8.10004278247251,"angle":-1.4601358160199376},{"x":758.5369129530012,"y":848.0396018839265,"mass":102,"radius":9,"velocity":9.908845853252666,"angle":0.12346294344961826}]}
```

If you create something cool, please share it with me!
