#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const Arguments = require("../src/args/arguments");
const generators = new Map([
    ["lines", require("../src/generators/lines")],
    ["circles", require("../src/generators/circles")], 
    ["rectangles", require("../src/generators/rectangles")],
    ["dots", require("../src/generators/dots")]
]);
const generatorNames = [];
const generatorClasses = [];
generators.forEach((g,k) => { generatorNames.push(k); generatorClasses.push(g); });
const multiGenerator = require("../src/generators/multi-generator");

const runtime = new Arguments(generatorNames, process.argv);

if (runtime.helpOnly) return;
try {
    // Make sure the output path exists
    if (!fs.existsSync(runtime.targetFolder)) throw new Error("Invalid target path");
    // Start working
    for (let i = 0; i < runtime.totalImages; i++) {
        // Gather the required generators
        let instance;
        if (runtime.generatorNames.length === 0) {
            instance = randomGenerator();
        } else if (runtime.generatorNames.length === 1) {
            switch (runtime.generatorNames[0]) {
                case 'all':
                    instance = new multiGenerator(runtime, generatorClasses);
                    break;
                case 'random':
                case 'any':
                    instance = randomGenerator();
                    break;
                default:
                    instance = specificGenerators();
                    break;
            }
        } else {
            instance = specificGenerators();
        }

        // Generate image
        instance.generate();
        if (runtime.watermark) {
            watermark(instance.context, i);
        }
        // Convert to bitmap data
        const imageData = instance.export();
        // Save
        const fileName = convertFileName(runtime.imageNameTemplate, i);
        fs.writeFileSync(path.join(runtime.targetFolder, fileName), imageData);
    }
}
catch(err) {
    console.error(`Runtime error: ${err}`);
}

function randomGenerator() {
    return new generatorClasses[Math.floor(Math.random() * generatorClasses.length)](runtime);
}

function specificGenerators() {
    const customGeneratorCollection = runtime.generatorNames.map(gn => generators.get(gn));
    return new multiGenerator(runtime, customGeneratorCollection);
}

/**
 * @param {CanvasRenderingContext2D} context 
 */
function watermark(context, index) {
    context.save();
    context.font = "normal normal 12px sans";
    context.fillStyle = "#000";
    context.textAlign = "left";
    const mark = (index + 1).toString();
    const measure = context.measureText(mark);
    if (measure.width > runtime.width || (measure.emHeightAscent + measure.emHeightDescent) > runtime.height) {
        context.restore();
        return;
    }
    context.fillText(mark, 1, 1 + measure.emHeightAscent + measure.emHeightDescent);
    context.restore();
}

function convertFileName(template, instanceCount) {
    let result = template;
    [
        {"width": () => runtime.width},
        {"height": () => runtime.height},
        {"serial": () => instanceCount}
    ].forEach(part => {
        const key = Object.keys(part)[0];
        result = result.split(`{${key}}`).join(part[key]());
    });
    return result + (runtime.format === "image/jpeg" ? ".jpg" : ".png");
}