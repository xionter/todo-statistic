const { getAllFilePathsWithExtension, readFile } = require('./fileSystem');
const { readLine } = require('./console');
const path = require('path');

console.log('Please, write your command!');
readLine(processCommand);

const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
const todos = parseComments();


function parseComments() {
    const result = [];

    const regex = /\/\/\s*TODO\s+(.*)/;

    for (const filePath of filePaths) {
        const content = readFile(filePath);
        const fileName = path.basename(filePath);
        const lines = content.split('\n');

        for (const line of lines) {
            const match = line.match(regex);
            if (!match) continue;

            const body = match[1].trim();
            const parts = body.split(';').map(p => p.trim());

            let user = null;
            let date = null;
            let text = body;

            if (parts.length >= 3) {
                user = parts[0] || null;
                date = parts[1] ? new Date(parts[1]) : null;
                text = parts.slice(2).join(';').trim();
            }

            if (date && isNaN(date)) {
                date = null;
            }
            result.push({ user, date, text, file: fileName});
        }
    }
    return result;
}

function getImportantTodos() {
    return todos.filter(t => t.text.includes('!'));
}

function getUserTodos(username) {
    return todos.filter(t =>
        t.user &&
        t.user.toLowerCase() === username.toLowerCase()
    );
}

function getTodosAfterDate(input) {
    const timestamp = normalizeDate(input);

    return todos.filter(t =>
        t.date && t.date > timestamp
    );
}

function normalizeDate(input) {
    const parts = input.split('-');
    const year = parts[0];
    const month = parts[1] || '01';
    const day = parts[2] || '01';

    return new Date(`${year}-${month}-${day}`);
}

function countExclamations(str) {
    return [...str].filter(ch => ch === '!').length;
}

function sortByImportance() {
    return [...todos].sort((a, b) =>
        countExclamations(b.text) - countExclamations(a.text)
    );
}

function sortByUser() {
    return [...todos].sort((a, b) => {
        if (!a.user && !b.user) return 0;
        if (!a.user) return 1;
        if (!b.user) return -1;

        return a.user.localeCompare(b.user);
    });
}

function sortByDate() {
    return [...todos].sort((a, b) => {
        if (!a.date && !b.date) return 0;
        if (!a.date) return 1;
        if (!b.date) return -1;
        return b.date - a.date;
    });
}

function processCommand(command) {
    const [instr, param] = command.split(' ');

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
            tableLog(getUserTodos(param));
            break;

        case 'date':
            tableLog(getTodosAfterDate(param));
            break;

        case 'sort':
            if (param === 'importance') tableLog(sortByImportance());
            else if (param === 'user') tableLog(sortByUser());
            else if (param === 'date') tableLog(sortByDate());
            else console.log('wrong sort parameter');
            break;

        default:
            console.log('wrong command');
    }
}

function tableLog(data) {
    if (!data.length) {
        console.log('No data');
        return;
    }

    const rows = data.map(t => [
        t.user || '',
        t.date ? t.date.toISOString().slice(0, 10) : '',
        t.text,
        t.file
    ]);

    const maxLimits = [12, 12, 40, 20];
    const widths = getColumnWidths(rows, maxLimits);

    for (const row of rows) {
        const formatted = row.map((cell, i) =>
            (cell || '').slice(0, widths[i]).padEnd(widths[i])
        );

        console.log(formatted.join('  |  '));
    }
}

function getColumnWidths(rows, maxLimits) {
    const widths = [];

    for (let col = 0; col < rows[0].length; col++) {
        let maxWidth = 0;
        for (const row of rows) {
            maxWidth = Math.max(maxWidth, (row[col] || '').length);
        }
        widths[col] = Math.min(maxWidth, maxLimits[col]);
    }
    return widths;
}
