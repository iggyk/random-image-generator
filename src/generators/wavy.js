const BaseGenerator = require("./base-generator");
const ColorGenerator = require("./color");

module.exports = class WavyLines extends BaseGenerator {

    /**
     * @override
     * @param {CanvasRenderingContext2D} context 
     */
    applyRandomContent(context) {
        context.save();
        context.beginPath();
        context.strokeStyle = ColorGenerator.randomColorAsRGBA(0.7);
        context.lineWidth = this.getRandomStrokeWidth();
        // Generate the waveform parameters
        const maxDim = Math.max(this.runtime.width, this.runtime.height);
        const length = maxDim * (0.2 + Math.random());
        const waveLength = Math.max(maxDim * 0.05, length * Math.random());
        const numWaves = 1 + Math.floor(length / waveLength);
        const amplitude = waveLength * (0.3 + Math.random() * 0.2);
        let x = this.runtime.width * Math.random();
        let y = this.runtime.height * Math.random();
        const stepX = length / numWaves;
        const halfStep = stepX / 2;
        let phase = Math.random() > 0.5 ? -1 : 1;
        // Draw
        context.rotate(Math.random() * (Math.PI * 2));
        for (let i = 0; i < numWaves * 2; i++) {
            // Draw wave segment
            context.moveTo(x, y);
            const phasePoint = amplitude * phase;
            context.bezierCurveTo(x,y + phasePoint,x + halfStep,y + phasePoint,x + halfStep,y)
            x += halfStep;
            phase *= -1;
        }
        context.stroke();
        context.restore();
    }

    getRandomStrokeWidth() {
        return 3 + Math.random() * (Math.max(this.runtime.width, this.runtime.height) / 100);
    }
}