import { expect, test, vi } from "vitest";
import { createTray } from "./tray.js";
import { app, BrowserWindow, Menu } from "electron";
import { Mock } from "node:test";

vi.mock("electron", () => {
  return {
    Tray: vi.fn().mockReturnValue({ setContextMenu: vi.fn() }),
    app: {
      getAppPath: vi.fn().mockReturnValue("/"),
      dock: {
        show: vi.fn(),
      },
      quit: vi.fn(),
    },
    Menu: {
      buildFromTemplate: vi.fn(),
    },
  };
});

const mainWindow = {
  show: vi.fn(),
} satisfies Partial<BrowserWindow> as any as BrowserWindow;

test("", () => {
  createTray(mainWindow);
  const calls = (Menu.buildFromTemplate as any).mock.calls;
  const args = calls[0] as Parameters<typeof Menu.buildFromTemplate>;

  const template = args[0];
  expect(template).toHaveLength(2);

  expect(template[1].label).toBe("Show");
  template[1]?.click?.(null as any, null as any, null as any);
  expect(mainWindow.show).toHaveBeenCalled();

  expect(template[0].label).toBe("Quit");
  template[0]?.click?.(null as any, null as any, null as any);
  expect(app.quit).toHaveBeenCalled();
});
