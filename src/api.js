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
    if (data === null) {
        return books;
    }
    data.forEach((item) => {
        if (item) { //in case of empty line
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
    if (data === null || data.length === 0) {
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
    if (data.length === 0) {
        return ["0.00", "0.00"];
    }
    let s = data[0].split(' ');
    return [s[1], s[3]];
}

function receive(channel, callback, mapping = data=>data) {
    ipcRenderer.once(channel, (event, data) => {
        if(data.pop()==='SUCCESS') {
            callback(mapping(data));
        }
    })
}

export function login(username, password, callback) {
    ipcRenderer.send('op', 'login', `su ${username} ${password}`);
    receive('login', callback);
}

export function search(key, value, callback) {
    ipcRenderer.send('op', 'search', key === '' ? 'show' : `show -${argTypes[key]}=${withQuotient[key] ? `"${value}"` : value}`);
    receive('search', callback, getBooks);
}

export function buy(key, cnt, callback) {
    ipcRenderer.send('op', 'buy', `buy ${key} ${cnt}`);
    receive('buy', callback);
}

export function add(key, callback) {
    ipcRenderer.send('op', 'add', `addBook ${key}`);
    receive('add', callback);
}

export function edit(values, callback) {
    let operation = 'modify';
    editKeys.forEach((key) => {
        if (values[key]) {
            operation += ` -${argTypes[key]}=${withQuotient[key] ? `"${values[key]}"` : values[key]}`;
        }
    });
    ipcRenderer.send('op', 'edit', operation);
    receive('edit', callback);
}

export function importBook(quantity, cost, callback) {
    ipcRenderer.send('op', 'import', `import ${quantity} ${cost}`);
    receive('import', callback);
}

export function select(key, callback) {
    ipcRenderer.send('op', 'select', `select ${key}`);
    receive('select', callback);
}

export function addUser(id, name, password, isClerk, callback) {
    ipcRenderer.send('op', 'addUser', isClerk ? `useradd ${id} ${password} 3 ${name}` : `register ${id} ${password} ${name}`);
    receive('addUser', callback);
}

export function logout(callback) {
    ipcRenderer.send('op', 'logout', 'logout');
    receive('logout', callback);
}

export function changePassword(id, oldPassword, newPassword, callback) {
    ipcRenderer.send('op', 'changePassword', `passwd ${id} ${oldPassword} ${newPassword}`);
    receive('changePassword', callback);
}

export function deleteUser(id, callback) {
    ipcRenderer.send('op', 'deleteUser', `delete ${id}`);
    receive('deleteUser', callback);
}

export function showUser(callback) {
    ipcRenderer.send('op', 'showUser', 'showUser');
    receive('showUser', callback, getAccounts);
}

export function showFinance(cnt, callback) {
    ipcRenderer.send('op', 'showFinance', `show finance ${cnt === null ? '' : cnt}`);
    receive('showFinance', callback, getFinance);
}

export function report(str, callback) {
    ipcRenderer.send('op', 'report', `${str}`);
    receive('report', callback);
}