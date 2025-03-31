export default function extractValidDomain(input: string): string | null {
  try {
    // localhost
    if (input === "localhost" || input.startsWith("localhost:")) {
      return input;
    }

    // Add protocol if missing to parse it as URL
    const url = new URL(input.includes("://") ? input : "https://" + input);
    const hostname = url.hostname.replace(/^www\./, "");

    // Simple domain pattern check
    const domainPattern = /^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
    if (!domainPattern.test(hostname)) return null;

    return hostname;
  } catch {
    return null;
  }
}
