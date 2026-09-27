export const urlParserKnowledge = {
  introduction:
    "A URL Parser & Query Tool allows you to inspect, decode, and manipulate URL structures and query parameters instantly. All processing is done locally using native browser APIs.",
  
  sections: [
    {
      title: "What is a URL?",
      content:
        "A Uniform Resource Locator (URL) is a reference to a web resource that specifies its location on a computer network and a mechanism for retrieving it. This tool helps you understand and modify the components of any URL.",
    },
    {
      title: "URL Structure",
      content:
        "A standard URL consists of several components: Protocol (e.g., https:), Hostname (e.g., example.com), Port (optional, e.g., 8080), Pathname (e.g., /products), Query string (e.g., ?id=123), and Hash fragment (e.g., #section).",
    },
    {
      title: "Query Parameters & Duplicate Keys",
      content:
        "Query parameters pass data to the server. A URL can contain multiple parameters with the same key (e.g., ?tag=js&tag=web). This tool preserves duplicate keys exactly as they appear, which is crucial for APIs that expect array-like query structures.",
    },
    {
      title: "Percent-Encoding and the '+' Sign",
      content:
        "In URL query strings, the '+' character is traditionally decoded as a space. To represent a literal plus sign, it must be percent-encoded as '%2B'. This tool uses standard browser decoding, so 'hello+world' becomes 'hello world', while 'hello%2Bworld' becomes 'hello+world'.",
    },
    {
      title: "encodeURIComponent() vs decodeURIComponent()",
      content:
        "These native JavaScript functions safely encode or decode specific parts of a URL (like a query parameter value) by escaping special characters. They should be used on individual components, not on an entire URL, to avoid breaking the URL structure.",
    },
    {
      title: "Absolute vs. Relative URLs",
      content:
        "This tool requires an **absolute URL** (e.g., https://example.com/path) because it needs a protocol to correctly parse components like hostname and origin. Relative URLs (e.g., /path or example.com) lack this context and will be rejected.",
    },
    {
      title: "Privacy & Processing",
      content:
        "🔒 **This tool does not visit, ping, or fetch the URL you enter.** All parsing and reconstruction are performed entirely within your browser using the native `URL` and `URLSearchParams` APIs. Your data never leaves your device.",
    },
    {
      title: "V1 Limitations",
      content:
        "This utility performs pure string manipulation and parsing. It does not perform HTTP requests, DNS lookups, HTTP status checking, redirect inspection, or URL reputation/scanning. It only tells you what the URL string represents structurally.",
    },
  ],
};