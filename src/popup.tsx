import { useEffect, useState } from "react";
import Switcher from "./components/Switcher";
import extractValidDomain from "./utils/extractValidDomain";
import Form from "./components/Form";
import { StorageKey } from "./types/StorageKeys";
import chromeUtils from "./utils/chromeUtils";

function setSyncStorage(key: string, value: string[], callback?: () => void) {
  return chrome.storage.sync.set({ [key]: value }, callback || (() => {}));
}

function Popup() {
  const [inputDomain, setInputDomain] = useState("");
  const [allowedSites, setAllowedSites] = useState<string[]>([]);

  useEffect(() => {
    // Get current tab and prefill input
    getCurrentTab();
    // Load stored allowed sites
    chromeUtils.getSyncStorage([StorageKey.AllowedSites], (res) => {
      setAllowedSites(res.allowedSites || []);
    });
  }, []);

  async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    const domain = tab.url ? extractValidDomain(tab.url) : "";
    setInputDomain(domain ?? "");
    return tab;
  }

  const updateAllowedSites = (updatedSites: string[]) => {
    if (chrome?.storage?.sync) {
      setSyncStorage(StorageKey.AllowedSites, updatedSites, () =>
        updateAllowed(updatedSites)
      );
    } else {
      updateAllowed(updatedSites);
    }
  };

  const updateAllowed = (updatedSites: string[]) => {
    setAllowedSites(updatedSites);
    setInputDomain(""); // Optional: clear input
  };

  return (
    <div className="p-4 font-sans flex flex-col w-screen lg:min-h-screen justify-around items-center">
      <h1 className="text-lg font-bold my-2 text-center flex-grow">Zen Mode</h1>
      <div className="mb-2 h-[150px] flex-shrink-0 flex self-center">
        <Switcher />
      </div>
      <div className="lg:w-1/4 md:w-full flex-grow">
        <Form
          defaultInput={inputDomain}
          allowedSites={allowedSites}
          updateAllowedSites={updateAllowedSites}
        />
        <div className="text-center">
          <hr className="text-gray-500 my-4" />
          <h2 className="font-semibold mb-1">Allowed Sites:</h2>
          <span>localhost (Default included)</span>
          {allowedSites.length > 0 && (
            <ul className="list-inside max-h-28 overflow-auto">
              {allowedSites.map((site) => (
                <li key={site}>{site}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Popup;
