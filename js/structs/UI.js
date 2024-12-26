
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
            ...options,
        };

        this.value = this.options.value;
        this.normalizedValue = (this.value - this.options.min) / (this.options.max - this.options.min);

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

        this.label = new PIXI.Text(`${this.options.description} : ${this.value / this.options.div}`, {
            fill: 0xffffff,
            fontSize: 12,
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

        this.label.text = `${this.options.description} : ${this.value / this.options.div}`;

        if (typeof this.options.onChange === 'function') {
            this.options.onChange(this.value);
        }
    }

    getValue() {
        return this.value;
    }

    setValue(value) {
        this.value = Math.max(this.options.min, Math.min(this.options.max, value));
        this.normalizedValue = (this.value - this.options.min) / (this.options.max - this.options.min);
        this.handle.x = this.normalizedValue * this.options.width;
        this.label.text = `${this.options.description} : ${this.value / this.options.div}`;
    }
}