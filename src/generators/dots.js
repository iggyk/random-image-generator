const BaseGenerator = require("./base-generator");
const ColorGenerator = require("./color");

module.exports = class DotsImage extends BaseGenerator {
    
    /**
     * @override
     * @param {CanvasRenderingContext2D} context 
     */
    applyRandomContent(context) {
        context.save();
        context.beginPath();
        context.fillStyle = ColorGenerator.randomColorAsRGBA();
        const size = Math.max(1, Math.random() * Math.max(this.runtime.width, this.runtime.height) / 25);
        context.fillRect(Math.random() * (this.runtime.width - size), Math.random() * (this.runtime.height - size), size, size);
        context.restore();
    }

    get name() {
        return 'Dots';
    }

    getDefaultIterations() {
        return super.getDefaultIterations() * 10;
    }
}