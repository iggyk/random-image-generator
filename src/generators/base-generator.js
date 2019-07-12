const { createCanvas } = require("canvas");

module.exports = class BaseGenerator {

    /**
     * @param {Arguments} runtime 
     */
    constructor(runtime) {
        this.runtime = runtime;
        this.canvas = createCanvas(this.runtime.width, this.runtime.height);
        this.context = this.canvas.getContext("2d");
        this.context.fillStyle = "#fff";
        this.context.fillRect(0,0,this.runtime.width, this.runtime.height);

        this.visiblePathWidth = Math.max(this.runtime.width, this.runtime.height) / 100;
    }

    getRandomStrokeWidth() {
        return this.visiblePathWidth * (1 + (Math.random() > 0.5 ? 1: -1) * (Math.random() / 2));;
    }

    generate() {
        let numberOfIterations = 1 + Math.floor(Math.random() * 50);
        while (numberOfIterations--) {
            this.applyRandomContent(this.context);
        }
    }

    /**
     * @param {CanvasRenderingContext2D} context 
     */
    applyRandomContent(context) {
    }

    export() {
        // Export canvas as encoded bitmap
        let options = undefined;
        if (this.runtime.format === "image/jpeg") {
            options = { quality: this.runtime.jpegQuality };
        }
        return this.canvas.toBuffer(this.runtime.format, options);
    }

}