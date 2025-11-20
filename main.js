const { app, BrowserWindow } = require('electron');

function createWindows() {
  const mainWin = new BrowserWindow({
    width: 1400,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      experimentalFeatures: true
    }
  });
  mainWin.loadFile('index.html');
  mainWin.webContents.openDevTools();
}

app.whenReady().then(() => {
    console.log('GPU feature status:', app.getGPUFeatureStatus());
  createWindows()
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindows();
});