export function getDiff<T extends Record<string, any>>(
  original: T,
  incoming: Partial<T>,
): Partial<T> {
  const changed: Partial<T> = {};

  for (const key in incoming) {
    if (incoming[key] !== undefined && incoming[key] != original[key]) {
      changed[key] = incoming[key];
    }
  }

  return changed;
}
