const {ipcRenderer} = require('electron')
const argTypes = {
    'ISBN': 'ISBN',
    'Name': 'name',
    'Author': 'author',
    'Keyword': 'keyword',
    'Price': 'price'
}
let keys = ['ISBN', 'Name', 'Author', 'Keyword', 'Price', 'Stock'];
let editKeys = ['Name', 'Author', 'Keyword', 'Price', 'ISBN'];
let withQuotient = {'ISBN': false, 'Name': true, 'Author': true, 'Keyword': true, 'Price': false};

function getBook(str) {
    let data = str.split('\t');
    let book = {};
    keys.forEach((key, index) => {
        book[key] = data[index];
        if (key === 'ISBN') {
            book['key'] = data[index];
        }
    });
    return book;
}

function getBooks(data) {
    let books = [];
    data.forEach((item) => {
        if (item) {
            books.push(getBook(item));
        }
    });
    return books;
}

let accountKeys = ['id', 'name', 'privilege'];

function getAccount(str) {
    let data = str.split(' ');
    let account = {};
    accountKeys.forEach((key, index) => {
        account[key] = data[index];
    });
    return account;
}

function getAccounts(data) {
    let accounts = [];
    if(data.length===0) {
        return accounts;
    }
    let currentAccount = getAccount(data.pop());
    let totalLength = currentAccount.id.length;
    data.some((item) => {
        let account = getAccount(item);
        if (totalLength + account.id.length < 20) {
            totalLength += account.id.length;
            accounts.push(account);
            return false;
        } else {
            accounts.push({id: '...'});
            return true;
        }
    });
    accounts.push(currentAccount);
    return accounts;
}

function getFinance(data) {
    if(data.length===0) {
        return ["0.00", "0.00"];
    }
    let s = data[0].split(' ');
    return [s[1], s[3]];
}

export function login(username, password, callback) {
    ipcRenderer.send('op', 'login', `su ${username} ${password}`);
    ipcRenderer.once('login', (event, data) => {
        callback(data);
    });
}

export function search(key, value, callback) {
    ipcRenderer.send('op', 'search', key === '' ? 'show' : `show -${argTypes[key]}=${withQuotient[key] ? `"${value}"` : value}`);
    ipcRenderer.once('search', (event, data) => {
        callback(getBooks(data));
    });
}

export function buy(key, cnt, callback) {
    ipcRenderer.send('op', 'buy', `buy ${key} ${cnt}`);
    ipcRenderer.once('buy', (event, data) => {
        callback(data);
    });
}

export function add(key, callback) {
    ipcRenderer.send('op', 'add', `addBook ${key}`);
    ipcRenderer.once('add', (event, data) => {
        callback(data);
    });
}

export function edit(values, callback) {
    let operation = 'modify';
    editKeys.forEach((key) => {
        if (values[key]) {
            operation += ` -${argTypes[key]}=${withQuotient[key] ? `"${values[key]}"` : values[key]}`;
        }
    });
    ipcRenderer.send('op', 'edit', operation);
    ipcRenderer.once('edit', (event, data) => {
        callback(data);
    });
}

export function importBook(quantity, cost, callback) {
    ipcRenderer.send('op', 'import', `import ${quantity} ${cost}`);
    ipcRenderer.once('import', (event, data) => {
        callback(data);
    });
}

export function select(key, callback) {
    ipcRenderer.send('op', 'select', `select ${key}`);
    ipcRenderer.once('select', (event, data) => {
        callback(data);
    });
}

export function addUser(id, name, password, isClerk, callback) {
    ipcRenderer.send('op', 'addUser', isClerk ? `useradd ${id} ${password} 3 ${name}` : `register ${id} ${password} ${name}`);
    ipcRenderer.once('addUser', (event, data) => {
        callback(data);
    });
}

export function logout(callback) {
    ipcRenderer.send('op', 'logout', 'logout');
    ipcRenderer.once('logout', (event, data) => {
        callback(data);
    });
}

export function changePassword(id, oldPassword, newPassword, callback) {
    ipcRenderer.send('op', 'changePassword', `passwd ${id} ${oldPassword} ${newPassword}`);
    ipcRenderer.once('changePassword', (event, data) => {
        callback(data);
    });
}

export function deleteUser(id, callback) {
    ipcRenderer.send('op', 'deleteUser', `delete ${id}`);
    ipcRenderer.once('deleteUser', (event, data) => {
        callback(data);
    });
}

export function showUser(callback) {
    ipcRenderer.send('op', 'showUser', 'showUser');
    ipcRenderer.once('showUser', (event, data) => {
        callback(getAccounts(data));
    });
}

export function showFinance(cnt, callback) {
    ipcRenderer.send('op', 'showFinance', `show finance ${cnt===null?'':cnt}`);
    ipcRenderer.once('showFinance', (event, data) => {
        callback(getFinance(data));
    });
}

export function report(str, callback) {
    ipcRenderer.send('op', 'report', `${str}`);
    ipcRenderer.once('report', (event, data) => {
        callback(data);
    });
}