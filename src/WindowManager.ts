import { WebviewWindow } from "@tauri-apps/api/window";

const windows = {
  main: "/",
  guesser: "/guess",
  timer: "/timer",
};

export function closeAllWindows() {
  Object.keys(windows).forEach((key: string) => {
    WebviewWindow.getByLabel(key)?.close();
  });
}
