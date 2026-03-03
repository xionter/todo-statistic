const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function parseComments() {
    let comments = []
    for (const content of files) {
        while (
        let idx = content.indexOf('// TODO ')
        console.log(content);
    }
}
function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'parse comments':
            parseComments();
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
