# Random Image Generator utility

Generates random images with a defined size. Can double as cheap post-modern abstract art generator.

## Features
- PNG/JPEG output formats
- Customizable image sizes
- Customizable output file names with tokens

## Installation
There's no `npm` installation at the moment. To install on local machine, clone the repo locally, then run `npm install && npm install . -g`

## Usage
Once installed, the utility should be available globally in command line.

Run `random --help` to get a summary of the parameters. Running `random` without any parameters will display help as well.

## Changelog

#### 1.0.10
- Added `wavy` generator!
- Updated the progress bar code to be compatible with debugger stdout
- Random RGBA color can now be biased on alpha-channel

#### 1.0.9
- Added progress bar to track image generation status
- Added task summary to be displayed
- Added `jpg` as a valid format (translates into `jpeg` internally)