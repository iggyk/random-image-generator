#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const Arguments = require("../src/args/arguments");
const generators = [require("../src/generators/lines"), require("../src/generators/circles"), require("../src/generators/rectangles")];
const multiGenerator = require("../src/generators/mulit-generator");

const runtime = new Arguments(process.argv);

if (runtime.helpOnly) return;
try {
    // Make sure the output path exists
    if (!fs.existsSync(runtime.targetFolder)) throw new Error("Invalid target path");
    // Start working
    for (let i = 0; i < runtime.totalImages; i++) {
        // Generate image
        let instance;
        if (runtime.multiGenerator) {
            instance = new multiGenerator(runtime, generators);
        } else {
            instance = randomGenerator();
        }
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
    return new generators[Math.floor(Math.random() * generators.length)](runtime);
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