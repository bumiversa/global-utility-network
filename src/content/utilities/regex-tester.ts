export const regexTesterKnowledge = {
  introduction:
    "A Regex Tester allows you to test regular expressions against text and inspect all matches, including capture groups and their positions. All processing is performed locally in your browser using native JavaScript RegExp.",
  
  sections: [
    {
      title: "How It Works",
      content:
        "The tool uses the native JavaScript `RegExp` object with `matchAll()` for global matches and `exec()` for single matches. This ensures 100% compatibility with standard regex syntax and behavior.",
    },
    {
      title: "Supported Flags",
      content:
        "V1 supports three flags: `g` (global - find all matches), `i` (case-insensitive), and `m` (multiline - treat each line as separate). Other flags like `s` (dotAll) or `u` (unicode) are not included in this version to maintain strict scope control.",
    },
    {
      title: "Capture Groups",
      content:
        "When your regex contains capture groups (parentheses), the tool displays each group's content for every match. Optional groups that don't match are shown as empty rather than undefined, ensuring consistent output.",
    },
    {
      title: "What This Tool Does NOT Do",
      content:
        "This is a **tester only**. It does not perform search-and-replace, syntax highlighting, regex explanation, or pattern generation. For those features, you would need a more comprehensive regex IDE.",
    },
    {
      title: "Privacy & Processing",
      content:
        "🔒 **100% Client-Side.** Your regex patterns and test text are processed entirely in your browser's memory. No data is sent to any server, stored, or logged.",
    },
  ],
};