const path = require("path");

module.exports = class Arguments {
    constructor(args = []) {
        this.totalImages = 5;
        this.targetFolder = './';
        this.width = 100;
        this.height = 100;
        this.format = "image/jpeg";
        this.imageNameTemplate = 'random-image-{width}-{height}-{serial}';
        this.helpOnly = false;
        this.multiGenerator = false;
        this.watermark = false;
        this.jpegQuality = 0.75;
        try {
            this.processArguments(args);
        }
        catch(error) {
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
    [mutliple|multi|combo] - use multiple generators on the same image
    [watermark|mark] - mark the serial number on the image. If the image is too small to fit the watermark, it will not be rendered
    [quality:<0..1>] - JPEG encoding quality; defaults to 0.75
    [output:<path>] - where to store the files

- width/height limit range is 1-10000 pixels; all values will be truncated to nearest min/max
- By default, the generator will produce 5 100x100px JPG images in the work folder.
- By default, the image template is 'random-image-{width}-{height}-{serial}', where each token is replaced by the corresponding value.
        `);
    }

    parseAsRangedInt(string, min = 1, max = 10000) {
        return Math.min(max, Math.max(min, parseInt(string,10)));
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
            const argParts = arg.split(":",2);
            switch (argParts[0].toLowerCase()) {
                case "npm":
                case "random":
                    // Nothing to do here
                    break;
                case "width":
                    this.width = this.parseAsRangedInt(argParts[1]);
                    break;
                case "height":
                    this.height = this.parseAsRangedInt(argParts[1]);
                    break;
                case "size":
                    const parts = argParts[1].split("x");
                    if (parts.length < 2) break;
                    this.width = this.parseAsRangedInt(parts[0]);
                    this.height = this.parseAsRangedInt(parts[1]);
                    break;
                case "format":
                    const format = argParts[1].toLowerCase();
                    if (format !== "jpeg" && format !== "png") {
                        throw new Error(`Invalid format: ${format}`);
                    }
                    this.format = `image/${format}`;
                    break;
                case "total":
                    this.totalImages = Math.max(0,parseInt(argParts[1],10));
                    break;
                case "multiple":
                case "multi":
                case "combo":
                    this.multiGenerator = true;
                    break;
                case "target":
                case "output":
                    this.targetFolder = path.normalize(argParts[1]);
                    console.log(this.targetFolder);
                    break;
                case "watermark":
                case "mark":
                    this.watermark = true;
                    break;
                case "quality":
                    this.jpegQuality = parseFloat(argParts[1]);
                    break;
                case "template":
                    this.imageNameTemplate = argParts[1];
                    break;
                case "help":
                case "?":
                case "/?":
                case "-h":
                case "--help":
                    this.help();
                    this.helpOnly = true;
                    break;
                default:
                    const argAsInt = parseInt(argParts[0],10);
                    if (!isNaN(argAsInt) && argAsInt > 0) {
                        this.totalImages = argAsInt;
                    } else {
                        unknownArguments = arg;
                        break;
                    }
            }
        }
        if (unknownArguments) {
            throw new Error(`Unknown arguments provided: ${unknownArguments}`);
        }
    }
}