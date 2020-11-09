'use strict'

import { app, BrowserWindow } from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 663,
    useContentSize: true,
    width: 1200,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // if (process.platform === 'darwin') {
  // // 判断设备为darwin 就是等于mac时执行的函数，因为electron可以打包出windows、mac端， 但是因为mac端有些方法执行和windows有不同，因此需要用这个判断来区分
  // // 在function createWindow()中，
  //   const template = [
  //     {
  //       label: 'Application',
  //       submenu: [
  //         {label: 'Quit', accelerator: 'Command+Q', click: function () { app.quit() }}
  //       ]
  //     },
  //     {
  //       label: 'Edit',
  //       submenu: [
  //         { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' }, // 复制
  //         { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' }, // 粘贴
  //         { label: 'Select All', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:' }// 全选
  //       ]
  //     }
  //   ]
  //   Menu.setApplicationMenu(Menu.buildFromTemplate(template))// 设置mac应用菜单栏
  // } else {
  //   Menu.setApplicationMenu(null)
  // }

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
