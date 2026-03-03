const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const todos = parseComments();
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
    return comments;
}
function getImportantTodos() {
    let important = []
    for(const todo of todos) {
        if(todo.includes('!')) {
            important.push(todo);
        }
    }
    return important;
}
function processCommand(command) {
    const split = command.split(' ');
    const instr = split[0];
    const param = split[1];
    switch (instr) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(todos);
            break;
        case 'important':
            const important = getImportantTodos();
            console.log(important);
            break;
        case 'user':
            console.log(param);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
