export default function getPackageDict(): {
  [key: string]: { label: string; cost: number };
} {
  return {
    document: { label: 'Document', cost: 1 },
    clothes: { label: 'Clothes', cost: 2 },
    electronics: { label: 'Electronics', cost: 3 },
    fragile: { label: 'Fragile', cost: 4 },
    other: { label: 'Other', cost: 2 },
  };
}
