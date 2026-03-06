export function secureD20(): number {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return (arr[0] % 20) + 1;
}
