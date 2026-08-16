/**
 * Minimal class-name merger.
 *
 * Kept dependency-free (no clsx / tailwind-merge). Falsy values are
 * dropped and arrays are flattened, so conditional classes read cleanly:
 *
 *   cn("btn", isActive && "btn-active", ["a", "b"])
 *
 * Conflict resolution is positional — put caller-supplied `className`
 * last so it wins.
 */
export function cn(...args) {
  return args
    .flat(Infinity)
    .filter((value) => typeof value === "string" && value.trim().length > 0)
    .join(" ")
    .trim();
}

export default cn;
