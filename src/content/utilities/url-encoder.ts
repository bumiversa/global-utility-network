export const urlEncoderKnowledge = {
  introduction:
    "A URL Encoder/Decoder transforms plain text into safe URI components and vice versa. All processing is performed locally in your browser using native JavaScript APIs.",
  
  sections: [
    {
      title: "How It Works",
      content:
        "This tool uses the native `encodeURIComponent()` and `decodeURIComponent()` functions. These functions ensure that special characters (like spaces, `&`, `?`, `=`, and Unicode/emoji) are safely percent-encoded so they can be used as part of a URL query string or path without breaking the URL structure.",
    },
    {
      title: "URI Component vs. Full URL",
      content:
        "This tool encodes/decodes **URI components** (e.g., a single query parameter value), not entire URLs. For encoding a full URL, different rules apply (using `encodeURI()`), which is outside the scope of this specific utility.",
    },
    {
      title: "Error Handling",
      content:
        "If you attempt to decode a string with malformed percent-encoding (e.g., `%ZZ` or a truncated `%2`), the tool will explicitly reject it with an error message rather than silently failing or returning corrupted text.",
    },
    {
      title: "Privacy & Processing",
      content:
        "🔒 **100% Client-Side.** Your text is processed entirely in your browser's memory. No data is sent to any server, stored in local storage, or included in analytics payloads.",
    },
  ],
};