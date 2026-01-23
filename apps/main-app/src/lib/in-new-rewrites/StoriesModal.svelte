<script lang="ts">
  import { Dialog } from "bits-ui";
  import { Button } from "$lib/components/ui/button";
  import { Progress } from "$lib/components/ui/progress";
  import { Badge } from "$lib/components/ui/badge";
  import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
  import { Skeleton } from "$lib/components/ui/skeleton";
  import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "$lib/components/ui/tooltip";
  import { X, ChevronLeft, ChevronRight } from "@lucide/svelte";
  import { PUBLIC_CLOUDINARY_CLOUD_NAME } from "$env/static/public";
  import {
    storiesModalOpen,
    storiesData,
    storiesLoading,
    storiesError,
    closeStoriesModal,
    loadStoriesData,
  } from "../in/storiesStore.js";
  import { formatBusinessName, formatDate, getImageUrl } from "$lib/constants/projectFormatters";


  let currentStoryIndex = $state(0);
  let storyProgress = $state(0);
  let progressInterval: ReturnType<typeof setInterval> | null = $state(null);
  let showViewAll = $state(false);

  const STORY_DURATION = 5000;
  const PROGRESS_UPDATE_INTERVAL = 50;

  function closeStory() {
    stopStoryProgress();
    showViewAll = false;
    currentStoryIndex = 0;
    storyProgress = 0;
    closeStoriesModal();
  }

  function nextStory() {
    if (currentStoryIndex < $storiesData.length - 1) {
      currentStoryIndex++;
      resetStoryProgress();
    } else {
      showViewAll = true;
      stopStoryProgress();
    }
  }

  function previousStory() {
    if (currentStoryIndex > 0) {
      currentStoryIndex--;
      resetStoryProgress();
    }
  }

  function startStoryProgress() {
    if (showViewAll) return;
    storyProgress = 0;
    progressInterval = setInterval(() => {
      storyProgress += (PROGRESS_UPDATE_INTERVAL / STORY_DURATION) * 100;
      if (storyProgress >= 100) {
        nextStory();
      }
    }, PROGRESS_UPDATE_INTERVAL);
  }

  function stopStoryProgress() {
    if (progressInterval) {
      clearInterval(progressInterval);
      progressInterval = null;
    }
    storyProgress = 0;
  }

  function resetStoryProgress() {
    stopStoryProgress();
    startStoryProgress();
  }

  function handleKeydown(event: KeyboardEvent) {
    if (!$storiesModalOpen) return;
    if (event.key === "Escape") closeStory();
    else if (event.key === "ArrowLeft") previousStory();
    else if (event.key === "ArrowRight") nextStory();
  }

  function handleStoryClick(area: "left" | "right") {
    if (area === "left") previousStory();
    else nextStory();
  }

  $effect(() => {
    if ($storiesModalOpen && $storiesData.length > 0 && !$storiesLoading) {
      showViewAll = false;
      currentStoryIndex = 0;
      setTimeout(() => {
        startStoryProgress();
      }, 300);
    }
  });

  $effect(() => {
    if ($storiesModalOpen && $storiesData.length === 0 && !$storiesLoading) {
      loadStoriesData();
    }
  });

  $effect(() => {
    return () => {
      stopStoryProgress();
    };
  });
</script>

<svelte:window onkeydown={handleKeydown} />

<TooltipProvider>
<Dialog.Root bind:open={$storiesModalOpen}>
  <Dialog.Content class="fixed inset-0 z-50 flex items-center justify-center bg-black/95 border-0 p-0 rounded-0 w-full max-w-none h-full max-h-none">
    <!-- Loading State -->
    {#if $storiesLoading}
      <div class="flex flex-col items-center justify-center w-full max-w-[theme(--max-width-sm)] gap-[theme(--spacing-lg)] px-[theme(--spacing-md)]">
        <Skeleton class="h-96 w-full rounded-[theme(--radius-lg)] bg-white/10" />
        <Skeleton class="h-12 w-full rounded-[theme(--radius-md)] bg-white/10" />
        <Skeleton class="h-8 w-2/3 rounded-[theme(--radius-md)] bg-white/10" />
        <p class="text-white text-center">Loading stories...</p>
      </div>
    {:else if $storiesError}
      <Card class="w-full max-w-[theme(--max-width-sm)] bg-[hsl(var(--destructive)/0.1)] border-[hsl(var(--destructive)/0.2)]">
        <CardHeader>
          <CardTitle class="text-destructive">Error Loading Stories</CardTitle>
        </CardHeader>
        <CardContent class="flex flex-col gap-[theme(--spacing-md)]">
          <p class="text-destructive/90">{$storiesError}</p>
          <Button onclick={closeStory} variant="default">Close</Button>
        </CardContent>
      </Card>
    {:else if $storiesData.length === 0}
      <Card class="w-full max-w-[theme(--max-width-sm)]">
        <CardHeader>
          <CardTitle>No Stories Available</CardTitle>
        </CardHeader>
        <CardContent class="flex flex-col gap-[theme(--spacing-md)]">
          <p class="text-foreground/90">No stories available at the moment.</p>
          <Button onclick={closeStory} variant="default">Close</Button>
        </CardContent>
      </Card>
    {:else if showViewAll}
      <!-- View All Screen -->
      <Card class="w-full max-w-[theme(--max-width-sm)]">
        <CardHeader>
          <CardTitle class="text-center">You've seen all our latest solar stories!</CardTitle>
        </CardHeader>
        <CardContent class="flex flex-col gap-[theme(--spacing-sm)]">
          <Button
            onclick={() => window.location.href = "/in/recent-solar-installation-projects"}
            variant="default"
            class="w-full"
          >
            View All Solar Projects →
          </Button>
          <Button
            onclick={() => {
              showViewAll = false;
              currentStoryIndex = 0;
              startStoryProgress();
            }}
            variant="outline"
            class="w-full"
          >
            ▶️ Replay Stories
          </Button>
          <Button onclick={closeStory} variant="outline" class="w-full">
            Close
          </Button>
        </CardContent>
      </Card>
    {:else}
      <!-- Story Viewer -->
      <div class="relative w-full h-full overflow-hidden flex flex-col bg-gradient-to-b from-black/80 to-black/40 max-w-[theme(--max-width-sm)]" style="max-height: 700px;">
        <!-- Progress Bars -->
        <div class="flex absolute top-0 left-0 right-0 z-40 gap-[theme(--spacing-xs)] p-[theme(--spacing-md)]">
          {#each $storiesData as _, index}
            <div class="flex-1">
              <Progress
                value={index < currentStoryIndex
                  ? 100
                  : index === currentStoryIndex
                    ? storyProgress
                    : 0}
                max={100}
                class="h-[theme(--progress-height)]"
              />
            </div>
          {/each}
        </div>

        <!-- Story Header -->
        <div class="flex items-center justify-between relative z-30 p-[theme(--spacing-md)] pt-16">
          <div class="flex items-center gap-[theme(--spacing-sm)]">
            <div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
              {formatBusinessName(String($storiesData[currentStoryIndex]?.business_slug || '')).charAt(0)}
            </div>
            <div>
              <h3 class="text-white text-[theme(--font-size-sm)] leading-[theme(--font-size-sm--line-height)] font-semibold">
                <a
                  href="/in/solar-panel-installer/{String($storiesData[currentStoryIndex]?.business_slug || '')}"
                  class="hover:text-secondary transition-colors duration-[theme(--duration-default)]"
                  onclick={closeStory}
                >
                  {formatBusinessName(String($storiesData[currentStoryIndex]?.business_slug || ''))}
                </a>
              </h3>
            </div>
          </div>
          <Tooltip>
            <TooltipTrigger>
              <Button
                onclick={closeStory}
                variant="ghost"
                size="icon-sm"
                class="text-white hover:bg-white/20"
                aria-label="Close stories"
              >
                <X size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">Close (Esc key)</TooltipContent>
          </Tooltip>
        </div>

        <!-- Story Image -->
        <div class="flex-1 flex flex-col items-center justify-center bg-black/30 min-h-0 relative">
          {#if getImageUrl($storiesData[currentStoryIndex], PUBLIC_CLOUDINARY_CLOUD_NAME, "w_800,h_800")}
            <img
              src={getImageUrl(
                $storiesData[currentStoryIndex],
                PUBLIC_CLOUDINARY_CLOUD_NAME,
                "w_800,h_800"
              )}
              alt={String($storiesData[currentStoryIndex]?.title || '')}
              class="w-full h-auto object-contain mt-[theme(--spacing-md)] max-h-[70vh]"
            />
          {:else}
            <div class="flex flex-col items-center justify-center gap-[theme(--spacing-sm)] text-white/80">
              <span class="text-4xl">📸</span>
              <p>No image available</p>
            </div>
          {/if}
        </div>

        <!-- Story Details Overlay -->
        <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent z-30 p-[theme(--card-padding-y)]">
          <h2 class="text-white text-[theme(--font-size-lg)] leading-[theme(--font-size-lg--line-height)] font-semibold mb-[theme(--spacing-sm)]">{$storiesData[currentStoryIndex].title}</h2>
          <div class="flex flex-wrap gap-[theme(--spacing-xs)]">
            <Badge variant="secondary" class="bg-white/20 text-white border-white/30 hover:bg-white/30">
              📍 {$storiesData[currentStoryIndex].pincode || "N/A"}
            </Badge>
            <Badge variant="secondary" class="bg-white/20 text-white border-white/30 hover:bg-white/30">
              📅 {formatDate(String($storiesData[currentStoryIndex]?.project_date || ''))}
            </Badge>
          </div>
        </div>

        <!-- Navigation Areas -->
        <div class="absolute left-0 top-1/2 -translate-y-1/2 z-20 ml-[theme(--spacing-md)]">
          <Tooltip>
            <TooltipTrigger>
              <Button
                onclick={() => handleStoryClick("left")}
                disabled={currentStoryIndex === 0}
                variant="ghost"
                size="icon"
                class="text-white hover:bg-white/20 disabled:opacity-50"
                aria-label="Previous story"
              >
                <ChevronLeft size={28} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Previous story (← key)</TooltipContent>
          </Tooltip>
        </div>

        <div class="absolute right-0 top-1/2 -translate-y-1/2 z-20 mr-[theme(--spacing-md)]">
          <Tooltip>
            <TooltipTrigger>
              <Button
                onclick={() => handleStoryClick("right")}
                variant="ghost"
                size="icon"
                class="text-white hover:bg-white/20"
                aria-label="Next story"
              >
                <ChevronRight size={28} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">Next story (→ key)</TooltipContent>
          </Tooltip>
        </div>
      </div>
    {/if}
  </Dialog.Content>
</Dialog.Root>
</TooltipProvider>
