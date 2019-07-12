const BaseGenerator = require("./base-generator");
const ColorGenerator = require("./color");

module.exports = class LinesImage extends BaseGenerator {
    applyRandomContent(context) {
        context.save();
        context.beginPath();
        context.strokeStyle = ColorGenerator.randomColorAsRGBA();
        context.lineWidth = this.getRandomStrokeWidth();
        context.moveTo(Math.random() * this.runtime.width, Math.random() * this.runtime.height);
        context.lineTo(Math.random() * this.runtime.width, Math.random() * this.runtime.height);
        context.stroke();
        context.restore();
    }
}