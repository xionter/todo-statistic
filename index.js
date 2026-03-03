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
    const comments = [];
    for (const content of files) {
        const lines = content.split('\n');
        for (const line of lines) {
            const idx = line.indexOf('// TODO ');
            if (idx !== -1) {
                const text = line.substring(idx + '// TODO '.length);
                comments.push(text.trim());
            }
        }
    }

    console.log(comments);
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
