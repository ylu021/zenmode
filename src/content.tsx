import React from "react";
import { createRoot } from "react-dom/client";
import Blocker from "./components/Blocker";
import "./index.css";
import { StorageKey } from "./types/StorageKeys";
import chromeUtils from "./utils/chromeUtils";

function extractValidDomain(input: string): string | null {
  try {
    // Add protocol if missing to parse it as URL
    const url = new URL(input.includes("://") ? input : "https://" + input);
    const hostname = url.hostname.replace(/^www\./, "");

    // localhost
    if (hostname === "localhost" || hostname.startsWith("localhost:")) {
      return hostname;
    }

    // Simple domain pattern check
    const domainPattern = /^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
    if (!domainPattern.test(hostname)) return null;

    return hostname;
  } catch {
    return null;
  }
}

const currentDomain = extractValidDomain(window.location.href);

chromeUtils.getSyncStorage(
  [StorageKey.AllowedSites, StorageKey.FocusMode],
  (res) => {
    const allowedSites: string[] = res.allowedSites || [];
    const focusMode = res.focusMode || false;
    if (!focusMode) return;

    const isAllowed =
      currentDomain === "localhost" ||
      allowedSites.some((site) => {
        if (site === currentDomain) return true;
        if (site.startsWith("*.")) {
          const base = site.replace("*.", "");
          return currentDomain?.endsWith(`.${base}`);
        }
        return false;
      });

    if (!isAllowed) {
      document.documentElement.innerHTML = "";

      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = chrome.runtime.getURL("content.css");
      document.head.appendChild(link);

      const mount = document.createElement("div");
      mount.id = "zen-blocker-root";
      document.body.appendChild(mount);
      createRoot(document.getElementById(mount.id)!).render(
        <React.StrictMode>
          <Blocker />
        </React.StrictMode>
      );
    }
  }
);
