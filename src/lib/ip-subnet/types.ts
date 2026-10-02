export interface SubnetResult {
  cidr: string;
  networkAddress: string;
  broadcastAddress: string;
  subnetMask: string;
  wildcardMask: string;
  firstHost: string;
  lastHost: string;
  totalAddresses: number;
  usableHosts: number;
  binaryIP: string;
  binaryMask: string;
}

export type SubnetOutput = 
  | { ok: true; data: SubnetResult }
  | { ok: false; error: string };