export const qrCodeGeneratorKnowledge = {
  introduction:
    "A QR Code Generator is a tool that creates scannable two-dimensional barcodes from plain text or URLs, allowing for quick information sharing.",
  
  sections: [
    {
      title: "How Does It Work?",
      content:
        "This utility uses your browser's built-in capabilities to encode your text into a QR code image. Because the generation happens locally, the text you enter is not sent to a server by this process.",
    },
    {
      title: "What Can I Encode?",
      content:
        "You can encode plain text or website URLs. Keep the text concise; extremely long texts will create dense QR codes that may be difficult for standard smartphone cameras to scan reliably.",
    },
    {
      title: "Why Client-Side Processing?",
      content:
        "Generating a QR code does not require server-side computation. By performing this task in your browser, we reduce network latency and keep your input data within your local environment.",
    },
    {
      title: "Important Limitations",
      content:
        "The generated QR code uses default error correction and margins to ensure maximum compatibility with standard scanners. For specialized industrial scanning requirements, a dedicated tool with custom parameter controls may be necessary.",
    },
  ],
};