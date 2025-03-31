import { StorageKey } from "../types/StorageKeys";
import chromeUtils from "../utils/chromeUtils";
import extractValidDomain from "../utils/extractValidDomain";

const currentDomain = extractValidDomain(window.location.href);

function Blocker() {
  const handleAllowSite = () => {
    chromeUtils.getSyncStorage(StorageKey.AllowedSites, (res) => {
      const allowed = res.allowedSites || [];

      if (currentDomain && !allowed.includes(currentDomain)) {
        const updated = [...allowed, currentDomain];
        chrome.storage.sync.set({ allowedSites: updated }, () => {
          location.reload();
        });
      } else {
        location.reload();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-[#F2F3F2] text-[#333] font-sans text-xl text-center p-4">
      🧘 Zen Mode
      <br />
      <p className="text-lg mb-6">
        This site (<span className="font-mono">{currentDomain}</span>) is
        blocked right now.
      </p>
      <button
        onClick={handleAllowSite}
        className="bg-[#4C6651] text-white px-4 py-2 rounded hover:opacity-90 transition"
      >
        Allow this site
      </button>
    </div>
  );
}

export default Blocker;
