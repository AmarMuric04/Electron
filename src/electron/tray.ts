import { app, BrowserWindow, Menu, Tray } from "electron";
import path from "path";
import { getAssetPath } from "./pathResolver.js";

export function createTray(mainWindow: BrowserWindow) {
  const tray = new Tray(
    path.join(
      getAssetPath(),
      process.platform === "darwin" ? "trayIcon@3x.png" : "trayIcon@3x.png"
    )
  );

  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: "Quit",
        click: () => app.quit(),
      },
      {
        label: "Show",
        click: () => {
          mainWindow.show();

          if (app.dock) {
            app.dock.show();
          }
        },
      },
    ])
  );
}
