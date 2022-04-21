import {
  app,
  BrowserWindow,
  shell,
  ipcMain,
  Menu,
  Tray,
  clipboard,
  nativeImage,
  globalShortcut,
  MenuItem,
  MenuItemConstructorOptions,
} from 'electron';
import { v4 as uuidv4 } from 'uuid';

import { getAssetPath } from '../util';
import { Store } from '../store';

let tray: Tray | null = null;

export const createTray = () => {
  const store = new Store({ configName: 'clip_it', defaults: {} });

  const image = nativeImage.createFromPath(getAssetPath('icon.png'));
  tray = new Tray(image.resize({ width: 16, height: 16 }));

  let contextMenu = Menu.buildFromTemplate(Object.values(store.data));
  tray.setToolTip('This is my application.');
  tray.setContextMenu(contextMenu);

  globalShortcut.register('CommandOrControl+C', () => {
    const text = clipboard.readText();
    const id = uuidv4();
    const item: MenuItemConstructorOptions = {
      id,
      label: text,
      role: 'copy',
      checked: false,
      click: () => {},
      enabled: true,
      type: 'normal',
    };
    store.set(id, item);

    contextMenu = Menu.buildFromTemplate(Object.values(store.data));
    tray?.setToolTip('This is my application.');
    tray?.setContextMenu(contextMenu);
  });

  console.log('STORE: ', store);

  return tray;
};

export default createTray;
