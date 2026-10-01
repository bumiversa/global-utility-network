export const fileHashKnowledge = {
  introduction:
    "A File Hash Inspector calculates cryptographic hashes (SHA-256, SHA-384, SHA-512) for any file directly in your browser. Verify file integrity without uploading to any server.",
  
  sections: [
    {
      title: "How It Works",
      content:
        "The tool reads the entire file into memory using the browser's File API, then calculates the hash using the native Web Crypto API (`crypto.subtle.digest()`). The resulting hash is displayed as a hexadecimal string that you can copy and compare against checksums provided by file distributors.",
    },
    {
      title: "Supported Algorithms",
      content:
        "V1 supports three modern cryptographic hash functions: SHA-256 (256-bit, recommended for most use cases), SHA-384 (384-bit), and SHA-512 (512-bit). Legacy algorithms like MD5 and SHA-1 are intentionally excluded due to known security vulnerabilities.",
    },
    {
      title: "File Size Limit",
      content:
        "To prevent memory pressure on your browser, files larger than 100 MB are rejected before processing. This is a deliberate V1 limitation. The entire file must be loaded into memory because the Web Crypto API does not support incremental/streaming hashing natively.",
    },
    {
      title: "What This Tool Does NOT Do",
      content:
        "This tool does not upload your file to any server, does not perform streaming/chunked hashing, does not support MD5/SHA-1, and does not compare hashes against databases. It is a pure client-side integrity verification tool.",
    },
    {
      title: "Privacy & Processing",
      content:
        "🔒 **100% Client-Side.** Your file is processed entirely in your browser's memory using native Web APIs. No data is sent to any server, stored, or logged. The file never leaves your device.",
    },
  ],
};