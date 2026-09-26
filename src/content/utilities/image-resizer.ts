export const imageResizerKnowledge = {
  introduction:
    "Image Resizer & Compressor is a tool that allows you to change the dimensions and file size of your images directly within your web browser, without uploading them to any server.",
  
  sections: [
    {
      title: "How Does It Work?",
      content:
        "This utility uses your browser's built-in Canvas API to decode, redraw, and re-encode your image. Because all processing happens locally on your device, your images never leave your computer.",
    },
    {
      title: "Understanding Image Formats",
      content:
        "JPEG and WEBP are lossy formats, meaning they discard some data to achieve smaller file sizes. The 'Quality' slider controls how much data is kept. PNG is a lossless format, which preserves all image data (including transparency) but typically results in larger file sizes.",
    },
    {
      title: "Why Can Output Be Larger?",
      content:
        "Resizing an image to larger dimensions or converting a highly compressed JPEG to a lossless PNG can result in a file size larger than the original. This is expected behavior based on how image data is stored.",
    },
    {
      title: "Limitations",
      content:
        "Because this tool runs in your browser, it is subject to your device's memory limits. Extremely large images (e.g., high-resolution panoramas) may fail to process if they exceed available browser resources.",
    },
  ],
};
