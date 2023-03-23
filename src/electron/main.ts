import { app, screen, BrowserWindow } from 'electron';

function createWindow() {
	const { width, height } = screen.getPrimaryDisplay().workAreaSize;
	const mainWindow = new BrowserWindow({
		width: width,
		height: height,
		titleBarStyle: 'hidden'
	});

	mainWindow.loadURL('http://localhost:5173');
}

app.whenReady().then(() => {
	createWindow();
});

app.on('window-all-closed', () => {
	app.quit();
});
