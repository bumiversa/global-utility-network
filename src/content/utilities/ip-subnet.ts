export const ipSubnetKnowledge = {
  introduction:
    "An IP Subnet Calculator performs deterministic mathematical calculations to analyze IPv4 CIDR blocks. It determines network boundaries, host ranges, and binary representations entirely within your browser.",
  
  sections: [
    {
      title: "How It Works",
      content:
        "The tool parses the IPv4 address and prefix length, then applies bitwise arithmetic to calculate the network address, broadcast address, and subnet mask. All calculations use strict unsigned 32-bit integer math to ensure accuracy.",
    },
    {
      title: "Host Bits Normalization",
      content:
        "If you enter an IP address with host bits set (e.g., `192.168.1.25/24`), the calculator automatically normalizes it to the correct network address (`192.168.1.0/24`). This helps verify the actual network boundary of any given IP.",
    },
    {
      title: "Special Prefix Cases",
      content:
        "This tool uses the classic subnetting model. A `/32` prefix represents a single host (1 usable address). A `/31` prefix is treated as having 0 usable hosts (reserved for network and broadcast in the classic model, though RFC 3021 allows point-to-point use). A `/0` represents the entire IPv4 space.",
    },
    {
      title: "What This Tool Does NOT Do",
      content:
        "This is a pure mathematical calculator. It does not perform network discovery, ping tests, DNS lookups, IPv6 calculations, or routing table analysis. No data is sent over the network.",
    },
    {
      title: "Privacy & Processing",
      content:
        "🔒 **100% Client-Side.** Your IP addresses are processed entirely in your browser's memory using native JavaScript. No data is transmitted, stored, or logged.",
    },
  ],
};