export const timestampConverterKnowledge = {
  introduction:
    "An Epoch / Unix Timestamp Converter translates between numeric timestamps and human-readable dates, a fundamental operation in software development, databases, and API integrations.",
  
  sections: [
    {
      title: "What is the Unix Epoch?",
      content:
        "The Unix Epoch is defined as January 1, 1970, at 00:00:00 UTC. Unix timestamps represent the number of seconds (or milliseconds) that have elapsed since this moment. This system provides a timezone-agnostic way to store and transmit time data across systems.",
    },
    {
      title: "The Seconds vs. Milliseconds Trap",
      content:
        "Different systems use different conventions: some APIs return 10-digit timestamps (seconds), while others return 13-digit timestamps (milliseconds). Always verify the unit before converting. A common mistake is treating a millisecond timestamp as seconds, which results in dates thousands of years in the future.",
    },
    {
      title: "UTC vs. Local Time",
      content:
        "UTC (Coordinated Universal Time) and your browser's local time represent the exact same instant in time, just displayed through different regional lenses. UTC is the standard reference, while local time adjusts for your geographic timezone. This utility shows both representations for clarity.",
    },
    {
      title: "Why Use Timestamps?",
      content:
        "Timestamps are widely used in databases, API payloads (such as JWT expiration claims), and logging systems because they provide a compact, unambiguous representation of time that is independent of timezone or calendar system.",
    },
    {
      title: "Privacy & Processing",
      content:
        "All timestamp conversions are performed entirely within your browser. The values you enter are not sent to our server for conversion.",
    },
  ],
};