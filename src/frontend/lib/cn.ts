/** Joins truthy class name fragments — a minimal `clsx` replacement so we avoid a new dependency. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
