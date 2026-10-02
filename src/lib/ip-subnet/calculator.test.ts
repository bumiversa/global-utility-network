import { describe, expect, it } from 'vitest';
import { calculateSubnet } from './calculator';

describe('IP Subnet Calculator', () => {
  it('T1. 192.168.1.25/24', () => {
    const result = calculateSubnet('192.168.1.25/24');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.networkAddress).toBe('192.168.1.0');
      expect(result.data.broadcastAddress).toBe('192.168.1.255');
      expect(result.data.subnetMask).toBe('255.255.255.0');
      expect(result.data.wildcardMask).toBe('0.0.0.255');
      expect(result.data.firstHost).toBe('192.168.1.1');
      expect(result.data.lastHost).toBe('192.168.1.254');
      expect(result.data.totalAddresses).toBe(256);
      expect(result.data.usableHosts).toBe(254);
    }
  });

  it('T2. 10.0.0.1/8', () => {
    const result = calculateSubnet('10.0.0.1/8');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.networkAddress).toBe('10.0.0.0');
      expect(result.data.broadcastAddress).toBe('10.255.255.255');
      expect(result.data.subnetMask).toBe('255.0.0.0');
      expect(result.data.totalAddresses).toBe(16777216);
      expect(result.data.usableHosts).toBe(16777214);
    }
  });

  it('T3. 172.16.10.20/20', () => {
    const result = calculateSubnet('172.16.10.20/20');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.networkAddress).toBe('172.16.0.0');
      expect(result.data.broadcastAddress).toBe('172.16.15.255');
      expect(result.data.subnetMask).toBe('255.255.240.0');
      expect(result.data.totalAddresses).toBe(4096);
      expect(result.data.usableHosts).toBe(4094);
    }
  });

  it('T4. 192.168.1.1/32', () => {
    const result = calculateSubnet('192.168.1.1/32');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.networkAddress).toBe('192.168.1.1');
      expect(result.data.broadcastAddress).toBe('192.168.1.1');
      expect(result.data.subnetMask).toBe('255.255.255.255');
      expect(result.data.totalAddresses).toBe(1);
      expect(result.data.usableHosts).toBe(1);
      expect(result.data.firstHost).toBe('192.168.1.1');
      expect(result.data.lastHost).toBe('192.168.1.1');
    }
  });

  it('T5. 192.168.1.1/31 (classic model)', () => {
    const result = calculateSubnet('192.168.1.1/31');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.networkAddress).toBe('192.168.1.0');
      expect(result.data.broadcastAddress).toBe('192.168.1.1');
      expect(result.data.totalAddresses).toBe(2);
      expect(result.data.usableHosts).toBe(0);
    }
  });

  it('T6. 0.0.0.0/0', () => {
    const result = calculateSubnet('0.0.0.0/0');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.networkAddress).toBe('0.0.0.0');
      expect(result.data.broadcastAddress).toBe('255.255.255.255');
      expect(result.data.subnetMask).toBe('0.0.0.0');
      expect(result.data.totalAddresses).toBe(4294967296);
      expect(result.data.usableHosts).toBe(4294967294);
    }
  });

  it('T7. Host bits normalization', () => {
    const result = calculateSubnet('192.168.1.25/24');
    expect(result.ok).toBe(true);
    if (result.ok) {
      // Host bits should be cleared in network address
      expect(result.data.cidr).toBe('192.168.1.0/24');
      expect(result.data.networkAddress).toBe('192.168.1.0');
    }
  });

  it('T8. Invalid IPv4 address', () => {
    const result = calculateSubnet('192.168.1/24');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe('Invalid IPv4 address.');
    }
  });

  it('T9. Invalid subnet prefix', () => {
    const result = calculateSubnet('192.168.1.1/33');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe('Invalid subnet prefix.');
    }
  });

  it('T10. Invalid CIDR format', () => {
    const result = calculateSubnet('192.168.1.1');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe('Invalid CIDR format.');
    }
  });

  it('T11. Binary representation', () => {
    const result = calculateSubnet('192.168.1.25/24');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.binaryIP).toBe('11000000.10101000.00000001.00011001');
      expect(result.data.binaryMask).toBe('11111111.11111111.11111111.00000000');
    }
  });

  it('T12. Boundary octets: 255.255.255.255/32', () => {
    const result = calculateSubnet('255.255.255.255/32');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.networkAddress).toBe('255.255.255.255');
      expect(result.data.broadcastAddress).toBe('255.255.255.255');
      expect(result.data.totalAddresses).toBe(1);
      expect(result.data.usableHosts).toBe(1);
    }
  });

  it('T13. Invariant: Network & Mask = Network', () => {
    const result = calculateSubnet('172.16.10.20/20');
    expect(result.ok).toBe(true);
    if (result.ok) {
      // This is implicitly tested by all other tests, but let's be explicit
      const network = result.data.networkAddress;
      const mask = result.data.subnetMask;
      expect(network).toBe('172.16.0.0');
      expect(mask).toBe('255.255.240.0');
    }
  });

  it('T14. Invariant: Network OR InverseMask = Broadcast', () => {
    const result = calculateSubnet('10.0.0.1/8');
    expect(result.ok).toBe(true);
    if (result.ok) {
      const network = result.data.networkAddress;
      const wildcard = result.data.wildcardMask;
      const broadcast = result.data.broadcastAddress;
      expect(network).toBe('10.0.0.0');
      expect(wildcard).toBe('0.255.255.255');
      expect(broadcast).toBe('10.255.255.255');
    }
  });
  it('rejects IPv4 octets with trailing characters', () => {
    const result = calculateSubnet('192.168.1abc.1/24');
    expect(result).toEqual({
      ok: false,
      error: 'Invalid IPv4 address.',
    });
  });

  it('rejects IPv4 octets with leading zeros', () => {
    const result = calculateSubnet('192.168.001.1/24');
    expect(result).toEqual({
      ok: false,
      error: 'Invalid IPv4 address.',
    });
  });
});