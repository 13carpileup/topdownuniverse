export class Slider {
    constructor(app, options) {
        this.app = app;

        this.options = {
            x: 0,
            y: 0,
            width: 300,
            height: 4,
            handleRadius: 8,
            min: 0,
            max: 100,
            value: 50,
            onChange: null, 
            log: false,
            ...options,
        };

        this.value = this.options.value;
        this.normalizedValue = (this.value - this.options.min) / (this.options.max - this.options.min);
        this.value /= this.options.div;

        this.sliderContainer = new PIXI.Container();
        this.sliderContainer.x = this.options.x;
        this.sliderContainer.y = this.options.y;

        this.track = new PIXI.Graphics();
        this.track.beginFill(0x272d37);
        this.track.drawRect(0, 0, this.options.width, this.options.height);
        this.track.endFill();

        this.handle = new PIXI.Graphics();
        this.handle.beginFill(0xffffff);
        this.handle.drawCircle(0, 0, this.options.handleRadius);
        this.handle.endFill();
        this.handle.x = this.normalizedValue * this.options.width;
        this.handle.y = this.options.height / 2;
        this.handle.interactive = true;
        this.handle.cursor = 'pointer';

        

        this.label = new PIXI.Text(`${this.options.description} : ${this.value}`, {
            fill: 0xffffff,
            fontSize: 15,
        });
        this.label.anchor.set(0.5);
        this.label.x = this.options.width / 2;
        this.label.y = -20;

        this.sliderContainer.addChild(this.track, this.handle, this.label);
        app.stage.addChild(this.sliderContainer);

        this.isDragging = false;
        this.handle
            .on('pointerdown', this.onDragStart.bind(this))
            .on('pointerup', this.onDragEnd.bind(this))
            .on('pointerupoutside', this.onDragEnd.bind(this));
        app.stage.on('pointermove', this.onDragMove.bind(this));
    }

    onDragStart() {
        this.isDragging = true;
    }

    onDragEnd() {
        this.isDragging = false;
    }

    onDragMove(e) {
        if (!this.isDragging) return;

        const localPos = this.sliderContainer.toLocal(e.global);

        const clampedX = Math.max(0, Math.min(this.options.width, localPos.x));
        this.handle.x = clampedX;

        this.normalizedValue = clampedX / this.options.width;

        this.value = Math.round(
            this.options.min + this.normalizedValue * (this.options.max - this.options.min)
        );

        this.value /= this.options.div;

        this.updateVal()
    }

    updateVal() {
        if (this.options.log) {
            this.value = 10 ** (this.value);
            this.value = Math.round(this.value);
        }

        this.label.text = `${this.options.description} : ${this.value}`;

        if (typeof this.options.onChange === 'function') {
            this.options.onChange(this.value);
        }
    }

    updateValue(value) {
        if (this.isDragging) return

        this.value = Math.round(value * this.options.div) / this.options.div;

        this.handle.x = ((this.value - this.options.min / this.options.div) / (this.options.max - this.options.min)) * this.options.width * this.options.div;

        if (this.options.log) {
            this.value = 10 ** (this.value);
            this.value = Math.round(this.value);
        }

        this.label.text = `${this.options.description} : ${this.value}`;
    }



    updatePosition(x, y, width) {
        this.options.x = x;
        this.options.y = y;
        this.options.width = width;
        
        this.sliderContainer.x = x;
        this.sliderContainer.y = y;
        
        this.track.clear();
        this.track.beginFill(0x272d37);
        this.track.drawRect(0, 0, width, this.options.height);
        this.track.endFill();
        
        this.label.x = width / 2;
        
        this.handle.x = this.normalizedValue * width;
    }

    getValue() {
        return this.value;
    }

    destroy() {
        this.track.destroy();
        this.sliderContainer.destroy();
    }
}

export class Button {
    constructor(app, options) {
        this.options = {
            x: 0,
            y: 0,
            description: "Error!",
            descriptionToggle: "null",
            onClick: null,
            ...options,
        }

        this.container = new PIXI.Container();
        [this.container.x, this.container.y] = [this.options.x, this.options.y - 25];

        this.background = new PIXI.Graphics();
        this.background.beginFill(0x888888);
        this.background.drawRoundedRect(0, 0, this.options.width, this.options.height, 10);
        this.background.endFill();
        this.container.interactive = true;
        this.container.buttonMode = true;

        this.label = new PIXI.Text(this.options.description, {
            fill: 0xFFFFFF,
            fontSize: 20,
            align: 'center',
        });

        this.label.anchor.set(0.5);
        this.label.x = this.options.width / 2;
        this.label.y = this.options.height / 2;
        
        this.container.addChild(this.background);
        this.container.addChild(this.label);
                
        this.container.on('pointerdown', () => {
            if (this.options.descriptionToggle != null) {
                if (this.label.text == this.options.descriptionToggle) this.label.text = this.options.description;
                else this.label.text = this.options.descriptionToggle;
            }

            if (typeof this.options.onClick === 'function') {
                this.options.onClick();
            }
        });
        
        app.stage.addChild(this.container);
    }

    updatePosition(x, y) {
        this.options.x = x;
        this.options.y = y;
        this.container.x = x;
        this.container.y = y - 25;
    }
}