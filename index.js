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

function getUserTodos(param) {
    let userTodos = [];
    for(const todo of todos) {
        const parts = todo.split(';');
        const username = parts[0].trim();
        if(username.toLowerCase() === param.toLowerCase()) {
            userTodos.push(todo);
        }
    }

    return userTodos;
}

function getTodosAfterData(dateInput) {
    let todosAfter = [];
    const timestamp = new normalizeDate(dateInput);
    for(const todo of todos) {
        const parts = todo.split(';');
        if(parts.length < 2) {
            continue;
        }

        const todoDate = new Date(parts[1].trim());
        if(!isNaN(todoDate) && todoDate > timestamp) {
            todosAfter.push(todo);
        }
    }
    return todosAfter;
}

function normalizeDate(input) {
    const parts = input.split('-');

    const year = parts[0];
    const month = parts[1] || '01';
    const day = parts[2] || '01';

    return new Date(`${year}-${month}-${day}`);
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
            console.log(getImportantTodos());
            break;
        case 'user':
            const users = getUserTodos(param);
            console.log(`${param} : ${users}`)
            break;
        case 'date':
            console.log(getTodosAfterData(param));
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
