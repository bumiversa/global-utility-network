export const colorContrastKnowledge = {
  introduction:
    "A Color Contrast Checker calculates the contrast ratio between two colors and evaluates them against W3C WCAG 2.x accessibility standards. All calculations are performed locally in your browser.",
  
  sections: [
    {
      title: "How It Works",
      content:
        "The tool converts input colors (HEX or RGB) to linear sRGB values using the official W3C breakpoint of 0.04045. It then calculates the relative luminance of each color and determines the contrast ratio using the formula: (L1 + 0.05) / (L2 + 0.05), where L1 is the lighter color. Thresholds are evaluated using full precision without premature rounding.",
    },
    {
      title: "Supported Formats",
      content:
        "V1 supports 3-digit HEX (#RGB), 6-digit HEX (#RRGGBB), and opaque RGB/RGBA formats. Transparent colors (alpha < 1) are explicitly rejected, as contrast ratio is defined between two opaque surfaces.",
    },
    {
      title: "Limitations",
      content:
        "Passing these contrast thresholds does not guarantee full accessibility compliance. It only verifies the mathematical contrast ratio for text readability. Other factors like font weight, actual rendered size, and surrounding context also impact accessibility.",
    },
    {
      title: "Privacy & Processing",
      content:
        "🔒 **100% Client-Side.** Your color inputs are processed entirely in your browser's memory using pure mathematical logic. No data is sent to any server, stored, or logged.",
    },
  ],
};