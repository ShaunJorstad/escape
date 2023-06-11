import { onKeyStroke } from "@vueuse/core";

const blockedShortcuts = [
  "CapsLock",
  "FnLock",
  "Hyper",
  "Meta",
  "NumLock",
  "ScrollLock",
  "Super",
  "SymbolLock",
  "OS",
  "LogOff",
  "Eject",
  "Power",
  "PowerOff",
  "PrintScreen",
  "Hibernate",
  "Standby",
  "F1",
  "F2",
  "F3",
  "F4",
  "F5",
  "F6",
  "F7",
  "F8",
  "F9",
  "F10",
  "F11",
  "F12",
  "AppSwitch",
  "AudioVolumeDown",
  "AudioVolumeUp",
  "AudioVolumeMute",
  "Close",
  "New",
  "Open",
  "Print",
  "Save",
  "BrowserBack",
  "BrowserForward",
  "BrowserHome",
  "BrowserRefresh",
];

export async function BlockKeys() {
  onKeyStroke(blockedShortcuts, (e) => {
    e?.preventDefault();
  });
}
