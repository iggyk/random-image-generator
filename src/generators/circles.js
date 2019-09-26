const BaseGenerator = require("./base-generator");
const ColorGenerator = require("./color");

module.exports = class CirclesImage extends BaseGenerator {
    
    /**
     * @override
     * @param {CanvasRenderingContext2D} context 
     */
    applyRandomContent(context) {
        context.save();
        context.beginPath();
        context.strokeStyle = ColorGenerator.randomColorAsRGBA();
        context.lineWidth = this.getRandomStrokeWidth();
        const filled = Math.random() > 0.5;
        const divisor = 1 + Math.random() * 5;
        const dimension = Math.random() > 0.5 ? this.runtime.width : this.runtime.height;
        const radius = Math.max(1, (Math.random() * dimension) / divisor);
        context.arc(Math.random() * this.runtime.width, Math.random() * this.runtime.height, radius, 0, Math.PI*2);
        if (filled) {
            // Filled circle
            context.fillStyle = ColorGenerator.randomColorAsRGBA();
            context.fill();
        } else {
            // Empty
            context.stroke();
        }
        context.restore();
    }
}