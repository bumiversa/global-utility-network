export const imageFormatConverterKnowledge = {
  introduction:
    "An Image Format Converter allows you to change the encoding of an image file (e.g., from PNG to JPEG or WEBP) directly in your browser, without uploading your data to any server.",
  
  sections: [
    {
      title: "How Does It Work?",
      content:
        "This utility uses the browser's native Canvas API to decode your image and re-encode it into the target format. Because all processing happens locally, your images never leave your device, ensuring complete privacy.",
    },
    {
      title: "JPEG: Lossy, No Transparency",
      content:
        "JPEG is a widely supported format optimized for photographs. It uses lossy compression, meaning some image data is discarded to reduce file size. Crucially, JPEG does not support an alpha (transparency) channel.",
    },
    {
      title: "PNG: Lossless, Supports Transparency",
      content:
        "PNG is a lossless format that preserves all image data and fully supports transparency (alpha channel). It is ideal for graphics, logos, and images requiring sharp edges or transparent backgrounds.",
    },
    {
      title: "WEBP: Modern Image Format",
      content:
        "WEBP is a modern format developed by Google that provides superior lossless and lossy compression for images on the web. It supports both transparency and animation, often resulting in significantly smaller file sizes than JPEG or PNG.",
    },
    {
      title: "Transparency During JPEG Conversion",
      content:
        "When converting an image with transparency (like PNG or WEBP) to JPEG, the transparency is lost because the JPEG format cannot store it. The browser will composite the transparent areas (often resulting in a darkened or solid background color) to make the image fully opaque.",
    },
    {
      title: "Privacy & Processing",
      content:
        "All image decoding, conversion, and encoding are performed entirely within your browser using the Canvas API. Your images are not uploaded, stored, or transmitted to any external server.",
    },
  ],
};