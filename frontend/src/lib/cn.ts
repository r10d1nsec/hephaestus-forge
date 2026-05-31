/** Tiny class-name joiner (clsx-lite) so we don't pull a dependency. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
