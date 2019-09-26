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
        this.iterations = this.runtime.iterations !== -1 ? this.runtime.iterations : this.getDefaultIterations();
        if (this.runtime.verbose) {
            console.log(`-- ${this.name}: generating (${runtime.width}x${runtime.height}) [${runtime.format}] using ${this.iterations} iterations`);
        }
    }

    get name() {
        throw new Error('Not implemented');
    }

    /**
     * @protected
     */
    getRandomStrokeWidth() {
        return this.visiblePathWidth * (1 + (Math.random() > 0.5 ? 1: -1) * (Math.random() / 2));;
    }

    /**
     * @public
     */
    generate() {
        let numberOfIterations = this.iterations;
        while (numberOfIterations--) {
            this.applyRandomContent(this.context);
        }
    }

    /**
     * @protected
     * @return {number}
     */
    getDefaultIterations() {
        // One element per 25 sq.px should be enough
        return Math.max(1, Math.floor((this.runtime.width * this.runtime.height) / 625));
    }

    /**
     * @protected
     * @param {CanvasRenderingContext2D} context 
     */
    applyRandomContent(context) {
    }

    /**
     * @public
     */
    export() {
        // Export canvas as encoded bitmap
        let options = undefined;
        if (this.runtime.format === "image/jpeg") {
            options = { quality: this.runtime.jpegQuality };
        }
        return this.canvas.toBuffer(this.runtime.format, options);
    }

}