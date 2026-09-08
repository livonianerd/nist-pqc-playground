export const hex = (bytes: Uint8Array) =>
  Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
export const size = (value?: number) =>
  value === undefined ? '—' : `${value.toLocaleString('en-US')} B`;
export const matches = (a?: Uint8Array, b?: Uint8Array) =>
  !!a &&
  !!b &&
  a.length === b.length &&
  a.every((value, index) => value === b[index]);
