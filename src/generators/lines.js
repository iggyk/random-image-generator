const BaseGenerator = require("./base-generator");
const ColorGenerator = require("./color");

module.exports = class LinesImage extends BaseGenerator {
    generate() {
        let numberOfLines = 1 + Math.floor(Math.random() * 100);
        while (numberOfLines--) {
            this.context.save();
            this.context.beginPath();
            this.context.strokeStyle = ColorGenerator.randomColorAsRGBA();
            this.context.lineWidth = 1 + Math.floor(Math.random() * 2);
            this.context.moveTo(Math.random() * this.runtime.width, Math.random() * this.runtime.height);
            this.context.lineTo(Math.random() * this.runtime.width, Math.random() * this.runtime.height);
            this.context.stroke();
            this.context.restore();
        }
    }
}