export function secureD20(): number {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  // arr[0] is always populated; ?? 0 only satisfies noUncheckedIndexedAccess.
  return ((arr[0] ?? 0) % 20) + 1;
}
