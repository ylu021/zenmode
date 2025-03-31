import { StorageValueMap } from "../types/StorageKeys";

function setSyncStorage<K extends keyof StorageValueMap>(
  key: K,
  value: StorageValueMap[K],
  callback?: () => void
) {
  if (!chrome) return;
  return chrome.storage.sync.set({ [key]: value }, callback || (() => {}));
}

function getSyncStorage<K extends keyof StorageValueMap>(
  key: K | K[],
  callback?: (val: Pick<StorageValueMap, K>) => void
) {
  if (!chrome || !chrome.storage) return;
  return chrome.storage.sync.get(key, callback || (() => {}));
}

export default {
  setSyncStorage,
  getSyncStorage,
};
