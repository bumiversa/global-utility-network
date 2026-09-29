export const csvJsonKnowledge = {
  introduction:
    "A CSV ↔ JSON Converter allows you to transform tabular CSV data into structured JSON, and vice versa. All processing is performed locally in your browser using pure JavaScript.",
  
  sections: [
    {
      title: "CSV to JSON",
      content:
        "Parses CSV with RFC 4180-style formatting and LF/CRLF line ending support. The first row is always treated as the header. All resulting JSON values are kept as strings to prevent unintended type inference (e.g., '00123' remains '00123', not 123). Nested structures are serialized as JSON strings, not flattened.",
    },
    {
      title: "JSON to CSV",
      content:
        "Serializes a JSON array of objects into CSV format. The keys of the first object determine the CSV headers. Missing properties in subsequent objects result in empty fields. Nested objects or arrays are safely serialized as JSON strings within quoted CSV fields.",
    },
    {
      title: "Strict Validation",
      content:
        "To ensure data integrity, the converter enforces strict rules: duplicate or empty headers are rejected, inconsistent column counts trigger an error, and unterminated quotes are flagged. This prevents silent data corruption during transformation.",
    },
    {
      title: "Privacy & Processing",
      content:
        "🔒 **All data transformation happens entirely in your browser.** Your CSV or JSON data is never sent to any server, stored in local storage, or included in analytics payloads. The converted data exists only in your current session and is cleared when you refresh the page.",
    },
  ],
};