const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    icon: path.join(__dirname, 'assets/icon.png'),
    title: 'PMSM Motor Testing System - Demo',
    show: false
  });

  mainWindow.loadFile('src/index.html');
  
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Remove menu bar for industrial look
  mainWindow.setMenuBarVisibility(false);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC handlers for demo functionality
ipcMain.handle('save-test-record', async (event, testData) => {
  // Simulate saving to database
  console.log('Saving test record:', testData);
  return { success: true, id: Date.now() };
});

ipcMain.handle('get-test-history', async () => {
  // Return simulated test history
  return generateMockTestHistory();
});

function generateMockTestHistory() {
  const history = [];
  for (let i = 0; i < 10; i++) {
    history.push({
      id: Date.now() - i * 86400000,
      serialNumber: `MTR${String(1000 + i).padStart(4, '0')}`,
      date: new Date(Date.now() - i * 86400000).toISOString(),
      result: Math.random() > 0.2 ? 'PASS' : 'FAIL',
      voltage: (220 + Math.random() * 20).toFixed(1),
      current: (5 + Math.random() * 2).toFixed(2),
      power: (1.1 + Math.random() * 0.3).toFixed(2),
      frequency: (50 + Math.random() * 2).toFixed(1),
      insulationPre: (500 + Math.random() * 100).toFixed(0),
      insulationPost: (480 + Math.random() * 100).toFixed(0)
    });
  }
  return history;
}