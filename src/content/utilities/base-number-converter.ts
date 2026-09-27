export const baseNumberConverterKnowledge = {
  introduction:
    "A Base Number Converter translates integers between different numeral systems (Binary, Octal, Decimal, Hexadecimal), a fundamental operation in computer science, networking, and low-level programming.",

  sections: [
    {
      title: "Why Do Computers Use Binary?",
      content:
        "Computers operate using electronic switches that have two states: on and off. Binary (base 2) maps directly to these states using digits 0 and 1. Every piece of data in a computer, from text to images, is ultimately stored as binary numbers.",
    },
    {
      title: "Octal and Hexadecimal: Human-Friendly Shorthand",
      content:
        "Reading long binary strings is error-prone. Octal (base 8) groups binary digits into sets of 3, while Hexadecimal (base 16) groups them into sets of 4. This makes hex especially useful for representing memory addresses, color codes (e.g., #FF5733), and byte values compactly.",
    },
    {
      title: "Arbitrary-Precision Integers",
      content:
        "This converter uses arbitrary-precision arithmetic, meaning it can handle integers of any size without losing accuracy. Unlike standard calculators that may round large numbers, every digit in your conversion is exact.",
    },
    {
      title: "Negative Numbers",
      content:
        "Negative integers are supported using a leading minus sign (e.g., -42). The converter displays the magnitude in each base with a minus prefix. Note that this is a mathematical representation, not a two's complement encoding used internally by processors.",
    },
    {
      title: "Privacy & Processing",
      content:
        "All number conversions are performed entirely within your browser using native JavaScript arithmetic. Your input values are never sent to any server, logged, or stored.",
    },
  ],
};