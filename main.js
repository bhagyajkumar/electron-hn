const { app, BrowserWindow, Menu, MenuItem } = require('electron')
const path = require('path')

var showdown = require('showdown'), 
converter = new showdown.Converter(),
text      = '# hello, markdown!',
html      = converter.makeHtml(text);

const isMac = process.platform === 'darwin'

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    console.log(html);
    win.loadURL(`data:text/html;charset=utf-8,${html}`)
}


const menu = new Menu()

menu.append(
    new MenuItem({
        label: "Hello",
        submenu: [{
            role: "help",
            accelerator: process.platform === 'darwin' ? 'Alt+Cmd+I' : 'Alt+Shift+I',
            click: () => { console.log('Sup') }
        }
        ]
    })
)

Menu.setApplicationMenu(menu)

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (!isMac) {
        app.quit()
    }
})