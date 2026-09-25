export const textCleanerKnowledge = {
  introduction:
    "Text Cleaner & Deduplicator is a utility for cleaning line-based text by removing duplicate entries, trimming surrounding whitespace, removing empty lines, and optionally sorting the result.",
  
  sections: [
    {
      title: "Cleaning Line-Based Text",
      content:
        "Text Cleaner works with text organized into separate lines. Each line can be processed independently, making the tool useful for lists such as URLs, email addresses, names, identifiers, or other line-based data.",
    },
    {
      title: "Removing Duplicate Lines",
      content:
        "When duplicate removal is enabled, identical lines are reduced to a single occurrence. This is useful when a list contains repeated entries and you want to keep one copy of each distinct line.",
    },
    {
      title: "Trimming and Removing Empty Lines",
      content:
        "Trimming removes whitespace from the beginning and end of each line. Empty-line removal then removes lines that contain no characters after the selected cleaning operations are applied.",
    },
    {
      title: "Sorting the Result",
      content:
        "Sorting arranges the resulting lines alphabetically using a case-insensitive comparison with numeric ordering. Sorting changes the order of the lines but does not otherwise modify their content.",
    },
    {
      title: "A Simple Workflow for List Cleanup",
      content:
        "A common workflow is to paste a line-based list, trim unnecessary whitespace, remove empty lines, remove duplicates, and optionally sort the result. The available options let you apply only the transformations needed for a particular list.",
    },
  ],
};
