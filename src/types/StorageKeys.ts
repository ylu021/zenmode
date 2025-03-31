export enum StorageKey {
  AllowedSites = "allowedSites",
  FocusMode = "focusMode",
}

export type StorageValueMap = {
  [StorageKey.AllowedSites]: string[];
  [StorageKey.FocusMode]: boolean;
};
