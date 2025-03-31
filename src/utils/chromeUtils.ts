import { StorageValueMap } from "../types/StorageKeys";
import extractValidDomain from "./extractValidDomain";

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

async function updateCurrentTab(updatedSites: string[]) {
  let queryOptions = { active: true, currentWindow: true };

  let [tab] = await chrome.tabs.query(queryOptions);
  if (!tab.id) return;
  const domain = tab.url ? extractValidDomain(tab.url) : "";
  const isMatched = updatedSites.some((site) => {
    if (site === domain) return true;
    if (site.startsWith("*.")) {
      const base = site.replace("*.", "");
      return domain?.endsWith(`.${base}`);
    }
    return false;
  });

  if (isMatched) {
    chrome.tabs.reload(tab.id);
  }
}

export default {
  setSyncStorage,
  getSyncStorage,
  updateCurrentTab,
};
