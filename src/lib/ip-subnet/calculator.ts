import type { SubnetOutput } from './types';

function ipToUint32(ip: string): number | null {
  const parts = ip.split('.');
  if (parts.length !== 4) return null;

  let result = 0;

  for (const part of parts) {
    // Require a complete decimal octet; reject signs, spaces,
    // suffixes, and ambiguous leading zeros.
    if (!/^(0|[1-9]\d{0,2})$/.test(part)) {
      return null;
    }

    const octet = Number(part);

    if (octet > 255) {
      return null;
    }

    result = result * 256 + octet;
  }

  return result;
}

function uint32ToIp(num: number): string {
  return [
    (num >>> 24) & 0xFF,
    (num >>> 16) & 0xFF,
    (num >>> 8) & 0xFF,
    num & 0xFF,
  ].join('.');
}

function uint32ToBinary(num: number): string {
  return [
    ((num >>> 24) & 0xFF).toString(2).padStart(8, '0'),
    ((num >>> 16) & 0xFF).toString(2).padStart(8, '0'),
    ((num >>> 8) & 0xFF).toString(2).padStart(8, '0'),
    (num & 0xFF).toString(2).padStart(8, '0'),
  ].join('.');
}

export function calculateSubnet(cidr: string): SubnetOutput {
  // Parse CIDR
  const cidrMatch = cidr.trim().match(/^([^/]+)\/(\d+)$/);
  if (!cidrMatch) {
    return { ok: false, error: 'Invalid CIDR format.' };
  }

  const ipStr = cidrMatch[1];
  const prefix = parseInt(cidrMatch[2], 10);

  // Validate prefix
  if (isNaN(prefix) || prefix < 0 || prefix > 32 || !Number.isInteger(prefix)) {
    return { ok: false, error: 'Invalid subnet prefix.' };
  }

  // Validate IP
  const ip = ipToUint32(ipStr);
  if (ip === null) {
    return { ok: false, error: 'Invalid IPv4 address.' };
  }

  // Calculate subnet mask
  const mask = prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0;
  
  // Calculate network address (IP AND mask)
  const network = (ip & mask) >>> 0;
  
  // Calculate broadcast address (network OR inverse mask)
  const inverseMask = (~mask) >>> 0;
  const broadcast = (network | inverseMask) >>> 0;
  
  // Calculate total addresses and usable hosts
  const totalAddresses = Math.pow(2, 32 - prefix);
  const usableHosts = prefix >= 31 ? (prefix === 32 ? 1 : 0) : totalAddresses - 2;
  
  // Calculate first and last host
  const firstHost = prefix >= 31 ? network : (network + 1) >>> 0;
  const lastHost = prefix >= 31 ? broadcast : (broadcast - 1) >>> 0;

  return {
    ok: true,
    data: {
      cidr: `${uint32ToIp(network)}/${prefix}`,
      networkAddress: uint32ToIp(network),
      broadcastAddress: uint32ToIp(broadcast),
      subnetMask: uint32ToIp(mask),
      wildcardMask: uint32ToIp(inverseMask),
      firstHost: uint32ToIp(firstHost),
      lastHost: uint32ToIp(lastHost),
      totalAddresses,
      usableHosts,
      binaryIP: uint32ToBinary(ip),
      binaryMask: uint32ToBinary(mask),
    },
  };
}