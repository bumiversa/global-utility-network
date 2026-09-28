export const uuidGeneratorKnowledge = {
  introduction:
    "A UUID (Universally Unique Identifier) Generator creates standardized 128-bit identifiers that provide an extremely low probability of collision. This tool generates UUID v4 (random) and UUID v7 (time-ordered) locally in your browser.",
  
  sections: [
    {
      title: "What is a UUID?",
      content:
        "A UUID is a 128-bit number used to uniquely identify information in computer systems. With a 128-bit value space, the probability of two UUIDs colliding under proper generation methods is negligible for most practical applications, though not mathematically zero. UUIDs are widely used for database keys, transaction identifiers, and distributed systems.",
    },
    {
      title: "UUID v4 vs UUID v7",
      content:
        "UUID v4 is generated using cryptographically secure random numbers, providing excellent uniqueness properties through randomness. UUID v7 (RFC 9562, 2024) embeds a Unix millisecond timestamp in the first 48 bits, making it sortable by creation time while maintaining randomness in the remaining bits. Note that UUID v7 is time-ordered at the millisecond level, but is not strictly monotonic when multiple UUIDs are generated within the same millisecond.",
    },
    {
      title: "RFC 9562 Compliance",
      content:
        "This tool implements UUID v7 according to RFC 9562 (May 2024), the official standard that supersedes the older RFC 4122. The implementation uses cryptographically secure random number generation via the browser's native `crypto.getRandomValues()` API, and UUID v4 via `crypto.randomUUID()`.",
    },
    {
      title: "UUID Structure",
      content:
        "A UUID is represented as 32 hexadecimal digits displayed in five groups separated by hyphens (8-4-4-4-12 format). The version number appears in the 13th position (e.g., '4' for v4, '7' for v7), and the variant bits appear in the 17th position, indicating the UUID follows the RFC 9562 standard.",
    },
    {
      title: "UUIDs Are Not Secrets",
      content:
        "UUIDs are designed for uniqueness, not secrecy. They should not be used directly as authentication tokens, session secrets, or password reset tokens without additional security measures. If you need unpredictable secrets, use a dedicated secure random generator or password generator.",
    },
    {
      title: "Privacy & Processing",
      content:
        "🔒 **UUIDs are generated entirely in your browser.** They exist only in page memory and are never stored in local storage, cookies, or the URL. They are never transmitted to any server, logged, or included in analytics payloads. Refreshing the page clears all generated UUIDs.",
    },
  ],
};