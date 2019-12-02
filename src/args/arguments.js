const path = require("path");

class Arguments {
    constructor(supportedGenerators) {
        this.totalImages = 5;
        this.width = 100;
        this.height = 100;
        this.format = "image/jpeg";
        this.jpegQuality = 0.75;
        this.generatorNames = [];
        this.supportedGenerators = supportedGenerators;
        this.iterations = 50;
    }

    static get ITERATION_CAP() {
        return 5000;
    }

    toString() {
        const format = this.format.replace("image/", "").toUpperCase();
        return `${this.totalImages} ${this.width}x${this.height} ${format}${this.totalImages > 1 ? 's' : ''} using ${this.generatorNames.join(",")}
Output folder: ${this.targetFolder}`;
    }
}

module.exports = Arguments;