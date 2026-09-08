export type Request = {
  op:
    'keygen' | 'encapsulate' | 'decapsulate' | 'sign' | 'verify' | 'benchmark';
  algorithm: string;
  publicKey?: Uint8Array;
  secretKey?: Uint8Array;
  ciphertext?: Uint8Array;
  signature?: Uint8Array;
  message?: string;
};
export type Result = {
  publicKey?: Uint8Array;
  secretKey?: Uint8Array;
  ciphertext?: Uint8Array;
  sharedSecret?: Uint8Array;
  signature?: Uint8Array;
  valid?: boolean;
  timings?: Record<string, number>;
  ms: number;
};
