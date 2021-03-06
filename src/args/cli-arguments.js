const Arguments = require("./arguments");
const path = require("path");

class CliArguments extends Arguments {
    constructor(supportedGenerators, args = []) {
        super(supportedGenerators);
        this.targetFolder = './';
        this.imageNameTemplate = 'random-image-{width}-{height}-{serial}';
        this.helpOnly = true;
        this.watermark = false;
        this.verbose = false;
        try {
            if (args && args.length) this.processArguments(args);
        } catch (error) {
            console.error(`Could not start the application because of: ${error}`);
            this.help();
            throw error;
        }
    }


    help() {
        console.log(`
Please provide a properly formatted set of arguments:

node random [total:]<number of images> [options]

Supported options:
    [width:<width>] - width, in pixels
    [height:<height>] - height, in pixels
    [size:<width>x<height>] - shorthand for dimensions
    [format:<format>] - jpeg or png
    [template:<template string>] - filename template, see below
    [generators:<genName,genName,...|all|random|any>] - which specific generators to use
                (available values: '${this.supportedGenerators.join("','")}').
                'all' will use all available generators randomly
                'random|any' will use a single randomly picked one
                'all' and 'random|any' override specific generators
    [iterations:<number>|auto] - number of iterations per image, defaults to 50, capped at ${Arguments.ITERATION_CAP}.
                If "auto" specified, the generator will try to determine the best value with the cap.
    [watermark|mark] - mark the serial number on the image. If the image is too small to fit the watermark, it will not be rendered
    [quality:<0..1>] - JPEG encoding quality; defaults to 0.75
    [output:<path>] - where to store the files
    [verbose] - verbose generation logging

- width/height limit range is 1-10000 pixels; all values will be truncated to nearest min/max
- By default, the generator will produce 5 100x100px JPG images in the work folder.
- By default, the image template is 'random-image-{width}-{height}-{serial}', where each token is replaced by the corresponding value.
        `);
    }

    /**
     * @param {string} string 
     * @param {number} min 
     * @param {number} max 
     * @return {number}
     */
    parseAsRangedInt(string, min = 1, max = 10000) {
        return Math.min(max, Math.max(min, parseInt(string, 10)));
    }

    /**
     * @private
     * @param {Array<string>} args 
     */
    processArguments(args) {
        let unknownArguments = null;
        if (args.length < 2) return;
        for (let i = 2; i < args.length; i++) {
            const arg = args[i];
            const argParts = arg.split(":", 2);
            switch (argParts[0].toLowerCase()) {
                case "npm":
                case "random":
                    // Nothing to do here
                    break;
                case "width":
                    this.width = this.parseAsRangedInt(argParts[1]);
                    this.helpOnly = false;
                    break;
                case "height":
                    this.height = this.parseAsRangedInt(argParts[1]);
                    this.helpOnly = false;
                    break;
                case "size":
                    const parts = argParts[1].split("x");
                    if (parts.length < 2) break;
                    this.width = this.parseAsRangedInt(parts[0]);
                    this.height = this.parseAsRangedInt(parts[1]);
                    this.helpOnly = false;
                    break;
                case "format":
                    let format = argParts[1].toLowerCase();
                    if (format === "jpg") format = "jpeg";
                    if (format !== "jpeg" && format !== "png") {
                        throw new Error(`Invalid format: ${format}`);
                    }
                    this.format = `image/${format}`;
                    this.helpOnly = false;
                    break;
                case "total":
                    this.totalImages = Math.max(0, parseInt(argParts[1], 10));
                    this.helpOnly = false;
                    break;
                case "target":
                case "output":
                    this.targetFolder = path.normalize(argParts[1]);
                    this.helpOnly = false;
                    break;
                case "watermark":
                case "mark":
                    this.watermark = true;
                    this.helpOnly = false;
                    break;
                case "quality":
                    this.jpegQuality = parseFloat(argParts[1]);
                    this.helpOnly = false;
                    break;
                case "template":
                    this.imageNameTemplate = argParts[1];
                    this.helpOnly = false;
                    break;
                case "help":
                case "?":
                case "/?":
                case "-h":
                case "--help":
                    this.helpOnly = true;
                    break;
                case "generators":
                    const expandedGeneratorList = this.supportedGenerators.concat("all", "random");
                    this.generatorNames = argParts[1]
                        .split(",")
                        .filter(g => expandedGeneratorList.includes(g));
                    if (this.generatorNames.includes("random") || this.generatorNames.length === 0) {
                        console.log(`Unknown generator(s) provided: ${argParts[1]}, will use random`);
                        this.generatorNames = ["random"];
                    }
                    if (this.generatorNames.includes("all")) {
                        this.generatorNames = ["all"];
                    }
                    console.log(this.generatorNames);
                    this.helpOnly = false;
                    break;
                case "iterations":
                    if (argParts[1].toLowerCase() === "auto") {
                        this.iterations = -1;
                        this.helpOnly = false;
                        break;
                    }
                    this.iterations = this.parseAsRangedInt(argParts[1], 1, Arguments.ITERATION_CAP);
                    this.helpOnly = false;
                    break;
                case "verbose":
                    this.verbose = true;
                    break;
                default:
                    const argAsInt = parseInt(argParts[0], 10);
                    if (!isNaN(argAsInt) && argAsInt > 0) {
                        this.totalImages = argAsInt;
                        this.helpOnly = false;
                    } else {
                        unknownArguments = arg;
                        break;
                    }
            }
        }
        if (unknownArguments) {
            throw new Error(`Unknown arguments provided: ${unknownArguments}`);
        }
        if (this.helpOnly) {
            this.help();
        }
    }
}

module.exports = CliArguments;