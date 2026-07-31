<script>
  // Reusable hero banner mirroring the /in home page hero.
  // Shows the page's existing title as overlaid text on the header video.
  let { title, subtitle = '' } = $props();

  let videoLoaded = $state(false);
  let videoRef = $state(null);

  $effect(() => {
    if (!videoRef) return;

    const onLoaded = () => { videoLoaded = true; };
    const onError = () => { console.log('Hero video failed to load, using static image'); };

    videoRef.addEventListener('loadeddata', onLoaded);
    videoRef.addEventListener('error', onError);

    return () => {
      videoRef?.removeEventListener('loadeddata', onLoaded);
      videoRef?.removeEventListener('error', onError);
    };
  });
</script>

<div class="relative w-full h-[theme(--height-lg)] flex items-center justify-center text-center overflow-hidden md:h-[42rem]">
  <!-- Static Image - Always visible initially, fades out when video loads -->
  <img
    class="absolute top-0 left-0 w-full h-full object-cover object-center z-0 transition-opacity duration-1000"
    class:opacity-0={videoLoaded}
    src="/header/header.avif"
    alt="Residential Solar Panel Installation in India"
    width="1920"
    height="600"
    fetchpriority="high"
    decoding="async"
  />

  <!-- Video - Fades in once loaded -->
  <video
    bind:this={videoRef}
    class="absolute top-0 left-0 w-full h-full object-cover object-center z-0 transition-opacity duration-1000"
    class:opacity-0={!videoLoaded}
    autoplay
    muted
    loop
    playsinline
    preload="metadata"
  >
    <source src="/video/installation-video.mp4" type="video/mp4" />
  </video>

  <div class="absolute top-0 left-0 w-full h-full z-10 bg-black/55"></div>
  <div class="relative z-20 max-w-3xl px-6">
    <h1 class="text-4xl md:text-5xl font-bold mb-6 text-primary-foreground leading-tight drop-shadow-lg">
      {title}
    </h1>
    {#if subtitle}
      <h2 class="text-2xl md:text-3xl font-medium mb-6 text-primary-foreground leading-snug drop-shadow-lg">
        {subtitle}
      </h2>
    {/if}
  </div>
</div>
