import { Parser, Builder } from 'xml2js';
import * as fs from 'fs';
import { Command } from 'commander'

const program = new Command();
const xmlParser = new Parser();
const xmlBuilder = new Builder({ doctype: { "sysID": "QLC"} });


    
function traverse(data, action) {
    action(data);

    for (let p in data) {
        if (data[p] instanceof Object && data.hasOwnProperty(p)) {
            traverse(data[p], action);
        }
    }
}

function colorHexToDec(color) {
    const hex = color.replace('#', '');
    return parseInt("ff" + hex, 16);
}

program
    .name('qlc-xml-editor')
    .description('Make meaningful bulk changes to QLC+ .qxw workspace files')
    .requiredOption('-i, --input <filename>', 'input qlc .qxw xml file')
    .requiredOption('-o, --output <filename>', 'output edited qlc .qxw xml file')
    .option('--widget-bg-color <color hex>', 'set the background color of all widgets')
    .option('--widget-fg-color <color hex>', 'set the foreground color of all widgets')
    .option('--set-reset-key <key>', 'set the reset key for all sliders')
    .showHelpAfterError();

program.parse();
const options = program.opts();

const inputStat = fs.statSync(options.input, {throwIfNoEntry: false});
if (!inputStat || !inputStat.isFile()) {
    program.error(`Input ${options.input} does not exist or isn't a file`);
}

const inputXmlString = fs.readFileSync(options.input, {encoding: 'utf-8'});
const qlcData = await xmlParser.parseStringPromise(inputXmlString);

const virtualConsoleFrame = qlcData.Workspace.VirtualConsole[0].Frame[0];

if (options.widgetBgColor || options.widgetFgColor) {
    traverse(virtualConsoleFrame, (element) => {
        if (options.widgetBgColor && element.hasOwnProperty("BackgroundColor")) {
            element["BackgroundColor"] = colorHexToDec(options.widgetBgColor);
        } 

        if (options.widgetFgColor && element.hasOwnProperty("ForegroundColor")) {
            element["ForegroundColor"] = colorHexToDec(options.widgetFgColor);
        }
    });
}

if (options.setResetKey) {
    traverse(virtualConsoleFrame, (element) => {
        if (element.hasOwnProperty("SliderMode")) {
            element["Reset"] = [{ "Key": [options.setResetKey] }];
        }
    });
}

const outputXmlString = await xmlBuilder.buildObject(qlcData);
fs.writeFileSync(options.output, outputXmlString, {encoding: 'utf-8'});