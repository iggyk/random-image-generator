const BaseGenerator = require("./base-generator");
const ColorGenerator = require("./color");

module.exports = class CirclesImage extends BaseGenerator {
    applyRandomContent(context) {
        context.save();
        context.beginPath();
        context.strokeStyle = ColorGenerator.randomColorAsRGBA();
        context.lineWidth = this.getRandomStrokeWidth();
        const filled = Math.random() > 0.5;
        const radius = Math.max(1, Math.random() * (Math.random() > 0.5 ? this.runtime.width : this.runtime.height) / 3);
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