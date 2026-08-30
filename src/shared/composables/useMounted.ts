import { readonly, ref, onMounted, type Ref } from "vue";

/**
 * Tracks whether the component has mounted on the client.
 *
 * Primary use: gating `<Teleport to="body">` with `v-if`.
 *
 * Astro's Vue renderer calls `renderToString(app)` and keeps only the returned
 * `html`, discarding Vue's separate teleport buffer. That means teleported
 * content never reaches the page and, critically, no `<!--teleport anchor-->`
 * comment is written into `<body>`. On hydration `hydrateTeleport` falls back to
 * `document.body.firstChild` and hydrates the teleport's children against
 * whatever real node happens to sit there, which mismatches and makes Vue
 * *remove* that node (it was eating the `.skip-link` in the site header).
 *
 * Gating the Teleport itself with `v-if="isMounted"` keeps SSR and the first
 * client render identical (both emit a comment placeholder), so the Teleport is
 * mounted fresh after hydration and never takes the hydration path at all.
 */
export function useMounted(): Readonly<Ref<boolean>> {
  const isMounted = ref(false);
  onMounted(() => {
    isMounted.value = true;
  });
  return readonly(isMounted);
}
