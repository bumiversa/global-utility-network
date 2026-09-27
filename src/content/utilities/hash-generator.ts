export const hashGeneratorKnowledge = {
  introduction:
    "A Hash Generator produces cryptographic fingerprints of text using industry-standard algorithms. The same input always produces the same hash, making it useful for verifying data integrity and detecting changes.",

  sections: [
    {
      title: "What is a Cryptographic Hash Function?",
      content:
        "A cryptographic hash function takes an input of any size and produces a fixed-size output (the hash) that is deterministic, irreversible, and collision-resistant. Even a tiny change in the input produces a completely different hash, a property known as the avalanche effect.",
    },
    {
      title: "SHA-256 vs SHA-512",
      content:
        "SHA-256 produces a 256-bit (64 hex character) hash and is widely used for digital signatures, certificates, and blockchain. SHA-512 produces a 512-bit (128 hex character) hash with stronger security margins, often preferred for long-term security or larger data sets.",
    },
    {
      title: "Why Not MD5 or SHA-1?",
      content:
        "MD5 and SHA-1 have known collision vulnerabilities that allow attackers to craft different inputs producing the same hash. They are no longer considered secure for cryptographic purposes. This utility intentionally supports only the modern SHA-2 family.",
    },
    {
      title: "UTF-8 Encoding Matters",
      content:
        "This utility encodes your input as UTF-8 before hashing. This means characters like accents (e.g., 'e' vs 'e'), emoji, and non-Latin scripts are hashed based on their byte representation. The same visible text in different encodings would produce different hashes.",
    },
    {
      title: "Common Use Cases",
      content:
        "Hash functions are used for data integrity verification, digital signatures, deduplication, fingerprinting, and many cryptographic constructions. Note that password storage requires specialized password-hashing algorithms (such as Argon2id, bcrypt, or scrypt) rather than a plain SHA-256 or SHA-512 hash.",
    },
    {
      title: "Privacy & Processing",
      content:
        "All hashing is performed entirely within your browser using the native Web Crypto API. Your input text is never sent to any server, logged, or stored. The hash exists only in your current session.",
    },
  ],
};