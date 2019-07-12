const BaseGenerator = require("./base-generator");
const ColorGenerator = require("./color");

module.exports = class CirclesImage extends BaseGenerator {
    generate() {
        let numberOfCircles = 1 + Math.floor(Math.random() * 50);
        while (numberOfCircles--) {
            this.context.save();
            this.context.beginPath();
            this.context.strokeStyle = ColorGenerator.randomColorAsRGBA();
            this.context.lineWidth = this.getRandomStrokeWidth();
            const filled = Math.random() > 0.5;
            const radius = Math.max(1, Math.random() * (Math.random() > 0.5 ? this.runtime.width : this.runtime.height) / 3);
            this.context.arc(Math.random() * this.runtime.width, Math.random() * this.runtime.height, radius, 0, Math.PI*2);
            if (filled) {
                // Filled circle
                this.context.fillStyle = ColorGenerator.randomColorAsRGBA();
                this.context.fill();
            } else {
                // Empty
                this.context.stroke();
            }
            this.context.restore();
        }
    }
}