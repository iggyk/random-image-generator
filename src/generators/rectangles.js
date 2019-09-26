const BaseGenerator = require("./base-generator");
const ColorGenerator = require("./color");

module.exports = class RectanglesImage extends BaseGenerator {

    get name() {
        return 'Rectangles';
    }

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
        const x = Math.random() * this.runtime.width * 0.5;
        const y = Math.random() * this.runtime.height * 0.5;
        const width = Math.random() * this.runtime.width * 0.5;
        const height = Math.random() * this.runtime.height * 0.5;
        const angle = Math.random() * Math.PI * 2;
        context.rotate(angle);
        if (filled) {
            // Filled circle
            context.fillStyle = ColorGenerator.randomColorAsRGBA();
            context.fillRect(x,y,width,height);
        } else {
            // Empty
            context.strokeRect(x,y,width,height);
        }
        context.restore();
    }
}