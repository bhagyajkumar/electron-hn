const { app, BrowserWindow, Menu, MenuItem, dialog, getAllWindows } = require('electron')
const path = require('path')
const fs = require('fs')

var showdown = require('showdown'),
    converter = new showdown.Converter(),
    text = '# hello, markdown!',
    html = converter.makeHtml(text);

const isMac = process.platform === 'darwin'

var win

function createWindow() {
    win = new BrowserWindow({
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
        label: "File",
        submenu: [{
            role: "open",
            label: "open",
            click: () => {
                dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] })
                    .then((val) => {
                        var path = val.filePaths[0]
                        fs.readFile(path, (err, data)=>{
                            html = converter.makeHtml(data.toString())
                            win.loadURL(`data:text/html;charset=utf-8,${html}`)
                        })  
                    }

                    )
            }
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
