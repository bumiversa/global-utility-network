export const base64Knowledge = {
  introduction:
    "Base64 is an encoding format that represents binary data as text using a limited set of 64 ASCII characters. It is widely used to safely transmit data across systems that only support text.",
  
  sections: [
    {
      title: "Is Base64 Encryption?",
      content:
        "No. Base64 is an encoding scheme, not encryption. Anyone can decode a Base64 string back to its original form. It is designed for data compatibility and transmission, not for security or hiding information.",
    },
    {
      title: "Base64 vs Base64URL",
      content:
        "Standard Base64 uses the characters '+' and '/', which can break URLs or file paths. Base64URL replaces these with '-' and '_', and removes the trailing '=' padding, making it perfectly safe to use in web addresses and filenames.",
    },
    {
      title: "Why UTF-8 Support Matters",
      content:
        "Standard browser Base64 functions often fail or corrupt data when processing emojis or non-Latin characters (like Arabic or Japanese). Our tool uses robust UTF-8 encoding to ensure your text remains perfectly intact.",
    },
    {
      title: "Common Use Cases",
      content:
        "Base64 is commonly used for embedding small images directly into HTML/CSS (Data URIs), transmitting JSON Web Tokens (JWT), and handling basic HTTP authentication headers.",
    },
  ],
};
