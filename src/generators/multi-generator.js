const BaseGenerator = require("./base-generator");

module.exports = class MultiGenerator extends BaseGenerator {

    /**
     * 
     * @param {Arguments} runtime 
     * @param {() => HTMLCanvasElement} createCanvas
     * @param {Array<Class>} generators 
     */
    constructor(runtime, createCanvas, generators) {
        super(runtime, createCanvas);
        this.generators = generators;
        /**
         * @type {Array<BaseGenerator>}
         */
        this.instances = [];
    }

    generate() {
        this.instances = this.generators.map(genClass => new genClass(this.runtime));
        super.generate();
    }

    get name() {
        return 'Multi-generator';
    }

    /**
     * @override
     * @param {CanvasRenderingContext2D} context 
     */
    applyRandomContent(context) {
        const index = Math.round(Math.random() * this.instances.length * 10) % this.instances.length;
        const instance = this.instances[index];
        instance.applyRandomContent(context);
    }
}