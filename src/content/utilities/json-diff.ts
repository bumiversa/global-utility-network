export const jsonDiffKnowledge = {
  introduction:
    "JSON Diff is a tool designed to compare two JSON documents structurally. Instead of just highlighting text differences, it understands the data, identifying exactly which keys or values have been added, removed, or changed.",
  
  sections: [
    {
      title: "Why Not Use a Plain Text Diff?",
      content:
        "Plain text diff tools fail with JSON because they are sensitive to formatting. If you simply reorder the keys or change the indentation, a text diff will show the entire file as changed, even if the actual data is identical. Structural JSON diff ignores formatting and focuses purely on the data.",
    },
    {
      title: "Understanding the Results",
      content:
        "Added means a key or value exists in the second JSON but not in the first. Removed means it existed in the first JSON but is missing in the second. Changed means the key exists in both documents, but its value or data type has changed.",
    },
    {
      title: "Common Use Cases",
      content:
        "Developers use JSON Diff to compare API responses before and after a code deployment, verify changes in configuration files like package.json or tsconfig.json, or debug state changes in complex applications.",
    },
    {
      title: "When Structural Comparison Matters",
      content:
        "Structural comparison is essential when dealing with large, minified, or dynamically generated JSON where key ordering is not guaranteed. It ensures you are comparing the actual data payload, not just the string representation.",
    },
  ],
};
