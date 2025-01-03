import { Slider, Button, TextInput } from "./UI.js";

export class Settings {
    constructor(app) {
        this.app = app;
        this.visible = false;
        this.sliders = [];
        this.buttons = [];
        this.textInputs = [];
        
        this.container = new PIXI.Container();
        this.container.x = app.screen.width - 300;
        this.container.y = 50;
        
        this.background = new PIXI.Graphics();
        this.background.zIndex = 1;
        this.drawBackground();
        
        this.title = new PIXI.Text('Settings', {
            fill: 0xFFFFFF,
            fontSize: 24,
        });
        this.title.zIndex = 2;
        this.title.x = 20;
        this.title.y = 20;
        
        this.closeButton = new PIXI.Text('×', {
            fill: 0xFFFFFF,
            fontSize: 24,
        });

        this.closeButton.zIndex = 2;
        this.closeButton.x = 250;
        this.closeButton.y = 15;
        this.closeButton.interactive = true;
        this.closeButton.cursor = 'pointer';
        this.closeButton.on('pointerdown', () => this.toggle());
        
        this.container.addChild(this.background, this.title, this.closeButton);
        
        this.createControls();
        
        app.stage.addChild(this.container);
        this.container.visible = false;
    }
    
    drawBackground() {
        this.background.clear();
        this.background.beginFill(0x1a1a1a, 1);
        this.background.drawRoundedRect(0, 0, 280, 430, 10); 
        this.background.endFill();
    }
    
    createControls() {
        this.sliders.push(new Slider(this.app, {
            x: this.container.x + 20,
            y: this.container.y + 100,
            width: 240,
            min: 0,
            max: 100,
            value: 1,
            div: 10,
            onChange: (value) => {
                window.gravityAmp = value;
            },
            description: "Simulation Speed"
        }));
        
        this.buttons.push(new Button(this.app, {
            x: this.container.x + 20,
            y: this.container.y + 160,
            width: 240,
            height: 40,
            description: "Toggle Grid",
            onClick: () => {
                window.grid = !window.grid;
            }
        }));

        this.buttons.push(new Button(this.app, {
            x: this.container.x + 20,
            y: this.container.y + 220,
            width: 240,
            height: 40,
            description: "Toggle Trails",
            onClick: () => {
                window.trails = !window.trails;
            }
        }));

        this.buttons.push(new Button(this.app, {
            x: this.container.x + 20,
            y: this.container.y + 280,
            width: 240,
            height: 40,
            description: "Export state",
            onClick: () => {
                let objects = [];
                window.uni.Objects.forEach((object) => {
                    const jsonObject = {
                        "x": object.x,
                        "y": object.y,
                        "mass": object.mass,
                        "radius": object.radius,
                        "velocity": Math.sqrt(object.vx ** 2 + object.vy ** 2),
                        "angle": Math.atan2(object.vy, object.vx),
                    };

                    objects.push(jsonObject);
                });

                let returnObject = {
                    "local": window.uni.local,
                    "zoom": window.uni.zoom,
                    "objects": objects,
                };

                navigator.clipboard.writeText(JSON.stringify(returnObject));
                alert("State data has been copied to your clipboard!");
            }
        }));

        this.buttons.push(new Button(this.app, {
            x: this.container.x + 20,
            y: this.container.y + 340,
            width: 240,
            height: 40,
            description: "Import state",
            onClick: () => {
                const input = prompt("Copy your state data here", "");

                try {
                    const obj = JSON.parse(input);
                    window.uni.clear();
                    window.zoom = obj.zoom;
                    window.local = obj.local;

                    obj.objects.forEach((object) => {
                        console.log(object.x, object.y, object.velocity);
                        window.uni.addObject(object.x, object.y, object.radius, object.velocity, object.angle, object.mass);
                    });
                }
                catch(err) {
                    console.log(err);
                    alert("Parsing error!");
                    return;
                }
                console.log('imported!');
            }
        }));

        this.buttons.push(new Button(this.app, {
            x: this.container.x + 20,
            y: this.container.y + 400,
            width: 240,
            height: 40,
            description: "Clear all",
            onClick: () => {
                window.uni.clear();
            }
        }));

        this.sliders.forEach((slider) => {
            slider.sliderContainer.zIndex = 2;
        });

        this.buttons.forEach((button) => {
            button.container.zIndex = 2;
        });

        this.textInputs.forEach((textInput) => {
            textInput.container.zIndex = 2;
        });
        
        this.updateControlsVisibility();
    }
    
    updateControlsVisibility() {
        this.sliders.forEach(slider => {
            slider.sliderContainer.visible = this.visible;
        });
        
        this.buttons.forEach(button => {
            button.container.visible = this.visible;
        });

        this.textInputs.forEach(textInput => {
            textInput.container.visible = this.visible;
        });
    }
    
    toggle() {
        this.visible = !this.visible;
        this.container.visible = this.visible;
        this.updateControlsVisibility();
    }
    
    handleResize() {
        this.container.x = this.app.screen.width - 300;
        
        this.sliders.forEach((slider, index) => {
            slider.updatePosition(
                this.container.x + 20,
                this.container.y + 100 + (index * 60),
                240
            );
        });
        
        this.buttons.forEach((button, index) => {
            button.updatePosition(
                this.container.x + 20,
                this.container.y + 100 + (this.sliders.length * 60 + index * 60)
            );
        });

        this.textInputs.forEach((textInput, index) => {
            textInput.updatePosition(
                this.container.x + 20,
                this.container.y + 100 + (this.sliders.length * 60 + this.buttons.length * 60 + index * 60)
            );
        });
    }
}