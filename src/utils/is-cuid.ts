const cuidRegex = /^c[a-z0-9]{24}$/;

export function isCuid(value: string): boolean {
  return cuidRegex.test(value);
}
