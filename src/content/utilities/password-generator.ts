export const passwordGeneratorKnowledge = {
  introduction:
    "A Password Generator creates cryptographically secure, human-usable credentials directly in your browser. It uses unbiased random selection to ensure maximum entropy based on your chosen parameters.",
  
  sections: [
    {
      title: "Cryptographic Randomness",
      content:
        "Unlike standard pseudo-random number generators, this tool uses the browser's native `crypto.getRandomValues()` API. This provides a Cryptographically Secure Pseudo-Random Number Generator (CSPRNG), making the output suitable for security-sensitive applications.",
    },
    {
      title: "Unbiased Character Selection",
      content:
        "Many generators use a simple modulo operation (`random % charset.length`), which introduces 'modulo bias' if the charset length does not evenly divide 256. This tool implements rejection sampling to guarantee that every character in your selected charset has an exactly equal probability of being chosen.",
    },
    {
      title: "Character Sets & Entropy",
      content:
        "Password strength (entropy) increases with both length and the size of the character set. Including uppercase, lowercase, numbers, and symbols maximizes the pool of possible characters, making brute-force attacks exponentially more difficult.",
    },
    {
      title: "Why Exclude Ambiguous Characters?",
      content:
        "Characters like lowercase 'l', uppercase 'I', number '1', uppercase 'O', and number '0' can be visually indistinguishable in many fonts. Excluding them prevents transcription errors when you need to manually type the password, without significantly reducing overall entropy.",
    },
    {
      title: "Privacy & Security Boundary",
      content:
        "ðŸ”’ **Passwords are generated entirely in your browser.** The generated password is kept strictly in page memory. This utility does not store it in local storage, cookies, or the URL, and does not transmit it to any server, log it, or include it in analytics payloads. Once you refresh the page, the generated password is permanently gone.",
    },
    {
      title: "Best Practices",
      content:
        "Use a unique, long password (16+ characters) for every service. Consider using a reputable password manager to store these generated credentials securely, rather than relying on memory or insecure notes.",
    },
  ],
};