export function useContent(locale: MaybeRefOrGetter<Locale>) {
  return useFetch<SiteContent>(() => `/api/content/${toValue(locale)}`, {
    key: `content-${toValue(locale)}`,
  })
}
