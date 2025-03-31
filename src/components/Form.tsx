import { useState } from "react";
import extractValidDomain from "../utils/extractValidDomain";

export default function form({
  defaultInput,
  allowedSites,
  updateAllowedSites,
}: {
  defaultInput: string;
  allowedSites: string[];
  updateAllowedSites: Function;
}) {
  const [inputDomain, setInputDomain] = useState(defaultInput);
  const [errorMessage, setErrorMessage] = useState("");

  const saveSite = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    const site = inputDomain.trim();
    const sanitized = extractValidDomain(site);
    if (!sanitized) {
      setErrorMessage(
        "Please enter a valid site or domain like example.com or https://example.com"
      );
      return;
    }

    if (!sanitized || allowedSites.includes(sanitized)) return;
    const updated = [...allowedSites, sanitized];
    updateAllowedSites(updated);
  };
  return (
    <form onSubmit={saveSite}>
      <label htmlFor="site-input" className="block mb-1 font-medium">
        Allow a site or domain:
      </label>
      <input
        id="site-input"
        value={inputDomain}
        onChange={(e) => {
          setInputDomain(e.target.value);
        }}
        className="border rounded px-2 py-1 w-full mb-2"
        placeholder="example.com"
      />
      <p className="text-red-300">
        {errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1)}
      </p>
      <button
        type="submit"
        disabled={!inputDomain.trim()}
        className="scheme-light-dark bg-black text-white px-3 py-1 rounded w-full my-4"
      >
        Add to Allowed Sites
      </button>
    </form>
  );
}
