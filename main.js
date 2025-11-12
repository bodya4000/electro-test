const { app, BrowserWindow } = require('electron');

// --- РОБОЧІ ФЛАГИ CHROMIUM ДЛЯ АПАРАТНОГО ПРИСКОРЕННЯ (VA-API) ---

app.commandLine.appendSwitch(
    'enable-features', 
    'VaapiVideoDecoder,VaapiVideoDecodeLinuxGL,VaapiIgnoreDriverChecks'
);

app.commandLine.appendSwitch('use-gl', 'egl');

app.commandLine.appendSwitch('ignore-gpu-blocklist');

app.commandLine.appendSwitch('enable-zero-copy');

app.commandLine.appendSwitch('disable-features', 'UseChromeOSDirectVideoDecoder');

// -----------------------------------------------------------------


function createWindows() {
  // Вікно 1: твоя основна сторінка
  const mainWin = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      experimentalFeatures: true
    }
  });
  mainWin.loadFile('index.html');

  // Вікно 2: сторінка GPU / перевірка
  const gpuWin = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Спроба відкрити chrome://gpu/
  gpuWin.loadURL('chrome://gpu').catch(() => {
    // Якщо не працює, можна завантажити локальну сторінку з перевіркою WebGL/WebGPU
  });

  // Відкриваємо DevTools у обох вікнах (за бажанням)
  mainWin.webContents.openDevTools();
  gpuWin.webContents.openDevTools();
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
