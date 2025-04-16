import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  onNavigateTab: (callback) => ipcRenderer.on('navigate-tab', (_, direction) => callback(direction))
});
