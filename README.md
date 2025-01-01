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