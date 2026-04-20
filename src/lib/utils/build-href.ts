type SearchParams = Record<string, string | string[] | undefined>;

export function buildHref(
  pathname: string,
  searchParams: SearchParams,
  nextPage?: number
): string {
  const sp = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (value === undefined) continue;

    if (Array.isArray(value)) {
      value.forEach((v) => sp.append(key, v));
    } else {
      sp.set(key, value);
    }
  }

  if (nextPage !== undefined) sp.set("page", String(nextPage));

  const qs = sp.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}
