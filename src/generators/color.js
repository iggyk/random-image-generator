module.exports = class ColorGenerator {
    static randomColorAsRGBA(transparencyBias = 1) {
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);
        const a = Math.random() * transparencyBias;
        return `rgba(${r},${g},${b},${a})`;
    }

    static randomColorAsRGB() {
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);
        return `rgb(${r},${g},${b})`;
    }
}