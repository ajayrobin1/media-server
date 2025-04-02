const { contextBridge } = require('electron')
const QRCode = require('qrcode');

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron
  // we can also expose variables, not just functions
})

contextBridge.exposeInMainWorld('electron', {
  generateQRCode: async (text) => {
      return await QRCode.toDataURL(text);
  }
});