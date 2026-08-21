<script>
  import HomePage from "$lib/components/HomePage.svelte";
</script>

<!--
  /in and /us render the same homepage as /. The three were forked per country
  for legacy reasons; the country-specific home was retired on 2026-08-22 in
  favour of one thin page whose job is to route into /{country}/solar. Nothing
  on it varies by country, so it takes no prop from `data.country` — that config
  is still loaded by the layout above, which does use it.
-->
<HomePage />
