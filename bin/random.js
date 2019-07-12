#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const Arguments = require("../src/args/arguments");
const generators = [require("../src/generators/lines")];

const runtime = new Arguments(process.argv);

if (runtime.helpOnly) return;
try {
    // Make sure the output path exists
    if (!fs.existsSync(runtime.targetFolder)) throw new Error("Invalid target path");
    // Start working
    for (let i = 0; i < runtime.totalImages; i++) {
        // Generate image
        const genInstance = randomGenerator();
        genInstance.generate();
        // Convert to bitmap data
        const imageData = genInstance.export();
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