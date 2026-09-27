export const secureRandomGeneratorKnowledge = {
  introduction:
    "A Secure Random Generator produces cryptographically secure random values using your browser's Web Crypto API, suitable for various security-sensitive applications.",
  
  sections: [
    {
      title: "What is a CSPRNG?",
      content:
        "A Cryptographically Secure Pseudo-Random Number Generator (CSPRNG) produces output that is computationally indistinguishable from true randomness. Even if an attacker knows all previously generated values, they cannot predict future outputs. This is fundamentally different from standard pseudo-random generators.",
    },
    {
      title: "Why Not Math.random()?",
      content:
        "JavaScript's Math.random() is a pseudo-random number generator that is not designed for security purposes. Its output can be predicted if the internal state is known, making it unsuitable for generating tokens, keys, or other security-sensitive values. The Web Crypto API provides cryptographically secure randomness instead.",
    },
    {
      title: "UUID v4 Explained",
      content:
        "UUID v4 is a universally unique identifier format that uses 122 random bits. The format includes version and variant bits that identify it as a version 4 UUID. While collisions are theoretically possible, the probability is approximately 2^-122 for any two randomly generated UUIDs, making them practically unique for most applications.",
    },
    {
      title: "Uniform Distribution Matters",
      content:
        "This generator uses rejection sampling to ensure each character in the selected charset has exactly equal probability of being chosen. Naive approaches like modulo operations can introduce bias when the charset size doesn't evenly divide the random number range, potentially weakening security.",
    },
    {
      title: "Privacy & Processing",
      content:
        "All random value generation occurs entirely within your browser using the Web Crypto API. Generated values are not stored, logged, or transmitted to any server. They exist only in your current session for immediate use.",
    },
  ],
};