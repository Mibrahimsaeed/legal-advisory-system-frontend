/** Placeholder profile shown until accounts are wired to a backend. */
export const MockUser = {
  name: 'Jordan Smith',
  email: 'jordan.smith@example.com',
} as const;

export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join('');
}
