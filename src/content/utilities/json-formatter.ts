export const jsonFormatterKnowledge = {
  introduction:
    "JSON Formatter is a tool designed to make raw, minified, or unstructured JSON data human-readable by applying consistent indentation, or conversely, to compress it for optimal production use.",
  
  sections: [
    {
      title: "Formatting vs. Minification",
      content:
        "Formatting adds whitespace and indentation to make JSON easy for humans to read and debug. Minification removes unnecessary whitespace to reduce payload size, which is a common practice for optimizing production environments.",
    },
    {
      title: "Why Validation Matters First",
      content:
        "Before formatting or minifying, this tool validates the JSON structure. If there are missing commas, unquoted keys, or trailing commas, it will catch the syntax error immediately, preventing silent failures in your application.",
    },
    {
      title: "Common Use Cases",
      content:
        "Developers use this tool to debug raw API responses, prepare configuration files like package.json or tsconfig.json for version control, and reduce payload sizes before deploying to production.",
    },
    {
      title: "How It Works",
      content:
        "The tool processes nested objects and arrays directly in your browser, preserving the underlying JSON data while changing its presentation between formatted and minified forms, without any external server dependency.",
    },
  ],
};
