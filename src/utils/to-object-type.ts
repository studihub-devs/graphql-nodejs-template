export function toObjectType<T>(
  Type: new (...args: never[]) => T,
  object: Partial<T>,
): T {
  return Object.assign(new Type(), object);
}
