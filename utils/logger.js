const config = require('config');
const fs = require('fs');
const path = require('path');
const logsFolder = path.resolve(__dirname, '..', 'logs');
let infoWritableStream, errorWritableStream;

try {
    if (!fs.existsSync(logsFolder)) {
        fs.mkdirSync(logsFolder);
    }

    infoWritableStream = fs.createWriteStream(path.join(logsFolder, 'info.log'), {flags: 'a'});
    errorWritableStream = fs.createWriteStream(path.join(logsFolder, 'error.log'), {flags: 'a'});
} catch (err) {
    console.error('Stream initialization Error');
}

process.on('beforeExit', () => {
    infoWritableStream.end();
    errorWritableStream.end();
})

const writeToErrorStream = (moduleName, ...args) => {
    errorWritableStream.write(`${new Date().toISOString()} ${moduleName}: ${args.join(' ')}\n`);
};

const writeToInfoStream = (moduleName, ...args) => {
    return infoWritableStream.write(`${new Date().toISOString()} ${moduleName}: ${args.join(' ')}\n`);
};

function getLoggers(moduleName) {
    const isColoredLogger = config.logger.colorsEnabled === '1';
    const loggerColors = isColoredLogger ? {
        default: "\x1b[0m",
        error: "\x1b[31m",
        warn: "\x1b[33m",
        success: "\x1b[34m"
    } : {
        default: "",
        error: "",
        warn: "",
        success: ""
    };

    const loggerMethods = {
        info: (...args) => {
            console.log(loggerColors.success, `${moduleName}:`, loggerColors.default, ...args);
            writeToInfoStream(moduleName, ...args);
        },
        warn: (...args) => {
            console.error(loggerColors.warn, `${moduleName}:`, loggerColors.default, ...args);
            writeToErrorStream(moduleName, ...args);
        },
        error: (...args) => {
            console.error(loggerColors.error, `${moduleName}:`, loggerColors.default, ...args);
            writeToErrorStream(moduleName, ...args);
        }
    };

    switch (config.server.logLevel) {
        case ('warn'):
            loggerMethods.info = (...args) => writeToErrorStream(moduleName, ...args);
            break;

        case ('error'):
            loggerMethods.info = (...args) => writeToInfoStream(moduleName, ...args);
            loggerMethods.warn = (...args) => writeToErrorStream(moduleName, ...args);
    }

    return loggerMethods;
}

module.exports = getLoggers;