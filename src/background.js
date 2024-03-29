'use strict'

import {app, protocol, BrowserWindow} from 'electron'
import {createProtocol} from 'vue-cli-plugin-electron-builder/lib'
import installExtension, {VUEJS3_DEVTOOLS} from 'electron-devtools-installer'

const isDevelopment = process.env.NODE_ENV !== 'production'
import {ipcMain} from 'electron'
import * as electron from "electron";

const path = require('path')

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
    {scheme: 'app', privileges: {secure: true, standard: true}}
])

async function createWindow() {
    // Create the browser window.
    const win = new BrowserWindow({
        autoHideMenuBar: true,
        show: false,
        webPreferences: {
            devTools: true,
            // Use pluginOptions.nodeIntegration, leave this alone
            // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
            nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
            contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
        }
    })
    win.maximize();
    win.show();
    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
        if (!process.env.IS_TEST) win.webContents.openDevTools()
    } else {
        createProtocol('app')
        // Load the index.html when not in development
        win.loadURL('app://./index.html')
    }

    const backend = require('cross-spawn').spawn('dist_backend/code.exe');
    backend.stdout.on('data', function (str) {
        let data = str.toString().split(/\r?\n/).slice(0, -1);
        console.log(`str ${str.toString()}`);
        console.log("dataS");
        console.log(data);
        console.log(data[0]);
        console.log(data.slice(1));
        console.log("dataE");
        win.webContents.send(data[0], data.slice(1));
    });
    backend.stderr.on('data', function (str) {
        win.webContents.send('errorMessage', str.toString()); //see Menu.vue
    });
    ipcMain.on('op', (event, id, op) => {
        console.log(`op ${event.sender} ${op}`);
        backend.stdin.write(op);
        backend.stdin.write('\n');
        backend.stdin.write(id);
        backend.stdin.write('\n');
    });
    ipcMain.on('quit', (event) => {
        app.exit(0);
    });
    win.webContents.setWindowOpenHandler(({ url }) => {
        electron.shell.openExternal(url);
        return { action: 'deny' };
    });
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
    if (isDevelopment && !process.env.IS_TEST) {
        // Install Vue Devtools
        try {
            await installExtension(VUEJS3_DEVTOOLS)
        } catch (e) {
            console.error('Vue Devtools failed to install:', e.toString())
        }
    }
    createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', (data) => {
            if (data === 'graceful-exit') {
                app.quit()
            }
        })
    } else {
        process.on('SIGTERM', () => {
            app.quit()
        })
    }
}
