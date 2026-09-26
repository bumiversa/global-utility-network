export const colorConverterKnowledge = {
  introduction:
    "A Color Converter is a tool that translates color values between different standard formats, helping developers and designers maintain consistency across their projects.",
  
  sections: [
    {
      title: "Understanding Color Formats",
      content:
        "HEX (#RRGGBB) is a compact hexadecimal representation widely used in web development. RGB (Red, Green, Blue) defines colors by mixing light intensities from 0 to 255. HSL (Hue, Saturation, Lightness) describes colors in a way that is often more intuitive for humans, separating the color type (Hue) from its vividness (Saturation) and brightness (Lightness).",
    },
    {
      title: "How the Conversion Works",
      content:
        "This utility performs mathematical transformations locally in your browser. When you change a value in one format, it calculates the canonical RGB representation and instantly derives the corresponding values for the other formats.",
    },
    {
      title: "Why Use HSL?",
      content:
        "HSL is particularly useful when you need to create color variations. For example, keeping the Hue constant while adjusting Lightness allows you to easily generate tints and shades of the same base color without complex calculations.",
    },
    {
      title: "Privacy & Processing",
      content:
        "All color calculations are performed entirely within your browser. No color data or usage patterns are sent to any external server.",
    },
  ],
};