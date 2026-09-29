export const textDiffKnowledge = {
  introduction:
    "A Plain Text Diff & Compare tool allows you to identify line-by-line differences between two blocks of text. All processing is performed locally in your browser using a pure JavaScript implementation of the Myers diff algorithm.",
  
  sections: [
    {
      title: "How It Works",
      content:
        "This tool uses the Myers Shortest Edit Script algorithm to find the minimal set of additions and deletions required to transform the Original text into the Modified text. It operates strictly on a line-by-line basis.",
    },
    {
      title: "Line-by-Line Comparison",
      content:
        "Unlike word-level diff tools, this utility compares entire lines. If a single character within a line changes, the entire line is marked as 'Removed' from the original and 'Added' in the modified version. This ensures clarity and predictable performance.",
    },
    {
      title: "Comparison Options",
      content:
        "**Case Sensitive**: When enabled, 'Hello' and 'hello' are treated as different lines. When disabled, they are considered identical, though the original casing is preserved in the output.\n\n**Ignore Trailing Whitespace**: When enabled, spaces or tabs at the end of a line are ignored during comparison, preventing false positives from invisible formatting changes.",
    },
    {
      title: "Performance Limits",
      content:
        "To ensure a responsive browser experience, the tool enforces a strict limit of 5,000 lines per input. Additionally, an internal work-unit safeguard prevents the algorithm from freezing on highly complex or pathological text patterns. If these limits are reached, a clear error message is displayed.",
    },
    {
      title: "Privacy & Processing",
      content:
        "🔒 **All text comparison happens entirely in your browser.** Your text is never sent to any server, stored in local storage, or included in analytics payloads. The comparison results exist only in your current session and are cleared when you refresh the page or click 'Clear'.",
    },
  ],
};