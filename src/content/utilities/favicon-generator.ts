export const faviconGeneratorKnowledge = {
  introduction:
    "A Favicon & App Icon Generator creates standardized icon sizes from any source image. All processing happens locally in your browser using the native Canvas API.",
  
  sections: [
    {
      title: "What is a Favicon?",
      content:
        "A favicon is a small icon displayed in browser tabs, bookmarks, and history. Modern websites typically need multiple sizes to support different browsers and devices.",
    },
    {
      title: "Standard Sizes",
      content:
        "This tool generates six standard sizes: 16×16 and 32×32 (commonly used for browser favicon assets), 48×48 and 64×64 (useful larger icon assets), 128×128 (useful high-resolution icon asset), and 180×180 (commonly used for Apple Touch Icon on iOS home screens).",
    },
    {
      title: "Why PNG Format?",
      content:
        "All outputs are generated as PNG files because PNG is widely supported by modern browsers, supports lossless compression, and preserves transparency (alpha channel). If your source image has a transparent background, it is preserved in the generated icons.",
    },
    {
      title: "Centered Square Crop",
      content:
        "When your source image is not square, this tool automatically crops it to a square from the center before resizing. This ensures the most central part of your image is preserved in the final icons.",
    },
    {
      title: "Privacy & Processing",
      content:
        "🔒 **All image processing happens entirely in your browser.** Your images are never uploaded to any server, stored, or transmitted. The generated icons exist only in your current session and are cleared when you refresh the page or upload a new image.",
    },
  ],
};