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
    setInputDomain("");
  };

  const deleteSite = (site: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to remove "${site}"?`
    );
    if (confirmed) {
      updateAllowedSites(allowedSites.filter((s) => s !== site));
    }
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
          <span className="mb-4">localhost (Default included)</span>
          {allowedSites.length > 0 && (
            <ul className="list-inside max-h-28 overflow-auto flex-col flex gap-y-4">
              {allowedSites.map((site) => (
                <li
                  key={site}
                  className="group border-b-1 light:border-b-slate-200 dark:border-b-gray-700 inline-flex w-full h-[40px] items-center justify-between gap-y-4"
                >
                  <span>{site}</span>
                  <DeleteButton
                    handleClick={() => deleteSite(site)}
                  ></DeleteButton>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

const DeleteButton = ({
  handleClick,
}: {
  handleClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) => {
  return (
    <button
      type="button"
      aria-label="Delete"
      className="hidden group-hover:block !bg-transparent !text-[#B46363] border-primary font-medium transition-colors duration-200 rounded-full hover:!border-[#984447] hover:!bg-[#984447] hover:!text-white"
      onClick={handleClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  );
};

export default Popup;
