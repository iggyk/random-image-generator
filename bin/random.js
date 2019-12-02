#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const CliArguments = require("../src/args/cli-arguments");
const { createCanvas } = require("canvas");
const Generators = require("../src/common/image-generators");

const generators = new Generators(createCanvas);
const runtime = new CliArguments(generators.names, process.argv);

if (runtime.helpOnly) return;
try {
    // Make sure the output path exists
    if (!fs.existsSync(runtime.targetFolder)) throw new Error("Invalid target path");
    console.log(`Generating ${runtime.toString()}`);
    // Start working
    for (let i = 0; i < runtime.totalImages; i++) {
        // Gather the required generators
        let instance;
        if (runtime.generatorNames.length === 0) {
            instance = randomGenerator();
        } else if (runtime.generatorNames.length === 1) {
            switch (runtime.generatorNames[0]) {
                case 'all':
                    instance = generators.createMultiGenerator(runtime, generators.classes);
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
        rewriteLine(generateProgressBar(i, runtime.totalImages));
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
    rewriteLine(generateProgressBar(runtime.totalImages, runtime.totalImages));
    console.log('\nDone');
} catch (err) {
    console.error(`Runtime error: ${err}`);
}

function generateProgressBar(done, total) {
    const prompt = "Progress: ";
    const opening = "[";
    const closing = "]  ";
    const empty = "_";
    const full = "X";
    if (process.stdout.columns) {
        const totalColumns = process.stdout.columns ? process.stdout.columns : 80;
        const leftoverColumns = totalColumns - prompt.length - opening.length - closing.length;
        const fulls = Math.round((done / total) * leftoverColumns);
        const resultArray = new Array(leftoverColumns);
        for (let i = 0; i < leftoverColumns; i++) {
            resultArray[i] = i <= fulls ? full : empty;
        }
        return `${prompt}${opening}${resultArray.join("")}${closing}`;
    }
    return `${Math.round((done / total) * 100)}%`;
}

function rewriteLine(message, clear = false) {
    if (clear && process.stdout.clearLine) process.stdout.clearLine();
    if (process.stdout.cursorTo) {
        process.stdout.cursorTo(0);
        process.stdout.write(message);
    } else {
        console.log(message);
    }
}

function randomGenerator() {
    const name = generators.names[Math.floor(Math.random() * generators.names.length)];
    return generators.createGeneratorInstance(name, runtime);
}

function specificGenerators() {
    const customGeneratorCollection = generators.names.map(gn => generators.get(gn));
    return generators.createMultiGenerator(runtime, customGeneratorCollection);
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
        { "width": () => runtime.width },
        { "height": () => runtime.height },
        { "serial": () => instanceCount }
    ].forEach(part => {
        const key = Object.keys(part)[0];
        result = result.split(`{${key}}`).join(part[key]());
    });
    return result + (runtime.format === "image/jpeg" ? ".jpg" : ".png");
}