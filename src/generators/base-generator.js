const { createCanvas } = require("canvas");

module.exports = class BaseGenerator {

    /**
     * @param {Arguments} runtime 
     */
    constructor(runtime, preventCanvasCreation = false) {
        this.runtime = runtime;
        if (preventCanvasCreation) return;
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
        // Approximate the number of iterations as 1 per each 50 square pixels
        let numberOfIterations = 1 + Math.floor((this.runtime.width * this.runtime.height) / 2500);
        // Use provided number of iteration if present
        if (this.runtime.iterations !== -1) {
            numberOfIterations = this.runtime.iterations;
        }
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