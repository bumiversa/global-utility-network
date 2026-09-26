export const unitConverterKnowledge = {
  introduction:
    "A Unit Converter is a tool that translates measurements between different standard units, helping you quickly understand quantities across different systems.",
  
  sections: [
    {
      title: "How Does It Work?",
      content:
        "This utility uses deterministic mathematical factors to convert your input. It first translates your value into a canonical base unit (e.g., meters for length, kilograms for weight), and then calculates the target unit. All calculations happen instantly in your browser.",
    },
    {
      title: "Why Use a Canonical Base Unit?",
      content:
        "Using a base unit ensures maximum accuracy and prevents rounding errors that can occur when converting directly between two non-base units. This method guarantees consistent results every time.",
    },
    {
      title: "Precision and Formatting",
      content:
        "While the internal calculation uses high-precision floating-point numbers, the displayed result is formatted for readability (up to 6 decimal places). This prevents visual clutter while maintaining practical accuracy.",
    },
    {
      title: "Privacy & Processing",
      content:
        "All unit conversions are performed entirely within your browser. The measurement values you enter are not sent to our server for conversion.",
    },
  ],
};