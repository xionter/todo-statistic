const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');
const path = require('path');

const getFiles = () => getAllFilePathsWithExtension(process.cwd(), 'js');

console.log('Please, write your command!');
readLine(processCommand);

const filePaths = getFiles();
const todos = parseComments();

function parseComments() {
    const comments = [];
    for (const filePath of filePaths) {
        const content = readFile(filePath);
        const fileName = path.basename(filePath);
        const lines = content.split('\n');
        for (const line of lines) {
            const idx = line.indexOf('// TODO ');
            if (idx !== -1) {
                const text = line.substring(idx + ('// TODO ').length).trim();
                comments.push(`${text}; ${fileName}`);
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
    const timestamp = normalizeDate(dateInput);
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
            tableLog(todos);
            break;
        case 'important':
            tableLog(getImportantTodos());
            break;
        case 'user':
            const users = getUserTodos(param);
            tableLog(`${param} : ${users}`)
            break;
        case 'date':
            tableLog(getTodosAfterData(param));
        default:
            console.log('wrong command');
            break;
    }
}

function tableLog(data) {

    const rows = data.map(row => row.split(';'));

    const maxLimits = [1, 10, 10, 50];
    const widths = getColumnWidths(rows, maxLimits);
    for (const row of rows) {
        const formatted = row.map((cell, i) => {
            const trimmed = cell.slice(0, widths[i]);
            return trimmed.padEnd(widths[i], ' ');
        });

        console.log(formatted.join('  |  '));
    }
}

function getColumnWidths(rows, maxLimits) {
    const widths = [];

    for (let col = 0; col < rows[0].length; ++col) {
        let maxWidth = 0;
        for (const row of rows) {
            const cell = row[col] || '';
            maxWidth = Math.max(maxWidth, cell.length);
        }
        widths[col] = Math.min(maxWidth, maxLimits[col]);
    }
    return widths;
}
// TODO you can do it!
