const _generators = new Map([
    ["lines", require("../generators/lines")],
    ["circles", require("../generators/circles")],
    ["rectangles", require("../generators/rectangles")],
    ["dots", require("../generators/dots")],
    ["wavy", require("../generators/wavy")]
]);
const _generatorNames = [];
const _generatorClasses = [];
_generators.forEach((g, k) => {
    _generatorNames.push(k);
    _generatorClasses.push(g);
});
const _multiGenerator = require("../generators/multi-generator");

class Generators {
    constructor(createCanvas) {
        this.createCanvas = createCanvas;
    }

    get names() {
        return _generatorNames;
    }

    get classes() {
        return _generatorClasses;
    }

    /**
     * @public
     * @param {string} name 
     * @param {Arguments} runtime
     * @param {boolean=} preventCanvasCreation
     * @return {BaseGenerator}
     */
    createGeneratorInstance(name, runtime, preventCanvasCreation = false) {
        if (!_generators.has(name)) throw new Error(`Unrecognized generator id: ${name}`);
        return new _generators.get(name)(runtime, this.createCanvas, preventCanvasCreation);
    }

    /**
     * @public
     * @param {Arguments} runtime
     * @param {Array<Class>} customGeneratorsCollection
     * @return {BaseGenerator}
     */
    createMultiGenerator(runtime, customGeneratorsCollection) {
        return new _multiGenerator(runtime, this.createCanvas, customGeneratorsCollection);
    }
}

module.exports = Generators;