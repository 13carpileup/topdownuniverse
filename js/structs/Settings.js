import { Slider, Button } from "./UI.js";

export class Settings {
    constructor(app) {
        this.app = app;
        this.visible = false;
        this.sliders = [];
        this.buttons = [];
        
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
        this.background.drawRoundedRect(0, 0, 280, 250, 10);
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

        this.sliders.forEach((slider) => {
            slider.sliderContainer.zIndex = 2;
        })

        this.buttons.forEach((button) => {
            button.container.zIndex = 2;
        })
        
        
        this.updateControlsVisibility();
    }
    
    updateControlsVisibility() {
        this.sliders.forEach(slider => {
            slider.sliderContainer.visible = this.visible;
        });
        
        this.buttons.forEach(button => {
            button.container.visible = this.visible;
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
                this.container.y + 160 + (index * 60)
            );
        });
    }
}