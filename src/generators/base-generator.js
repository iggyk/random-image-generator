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
    }

    generate() {
    }

    export() {
        // Export canvas as encoded bitmap
        return this.canvas.toBuffer(this.runtime.format);
    }

}