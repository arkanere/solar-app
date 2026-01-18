<script lang="ts">
  import { Dialog } from "bits-ui";
  import { Button } from "$lib/components/ui/button";
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

<Dialog.Root bind:open={$storiesModalOpen}>
  <Dialog.Content class="fixed inset-0 z-50 flex items-center justify-center bg-black/95 border-0 p-0 rounded-0 w-full max-w-none h-full max-h-none">
    <!-- Loading State -->
    {#if $storiesLoading}
      <div class="flex flex-col items-center justify-center gap-4">
        <div class="w-12 h-12 border-4 border-white/20 border-l-white rounded-full animate-spin"></div>
        <p class="text-white">Loading stories...</p>
      </div>
    {:else if $storiesError}
      <div class="flex flex-col items-center justify-center gap-4">
        <p class="text-white">Error: {$storiesError}</p>
        <Button onclick={closeStory} variant="default">Close</Button>
      </div>
    {:else if $storiesData.length === 0}
      <div class="flex flex-col items-center justify-center gap-4">
        <p class="text-white">No stories available at the moment.</p>
        <Button onclick={closeStory} variant="default">Close</Button>
      </div>
    {:else if showViewAll}
      <!-- View All Screen -->
      <div class="flex flex-col items-center justify-center gap-6 text-center px-4">
        <h2 class="text-white text-2xl font-semibold">You've seen all our latest solar stories!</h2>
        <Button
          onclick={closeStory}
          on:click={() => window.location.href = "/in/recent-solar-installation-projects"}
          variant="default"
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
          class="bg-success text-success-foreground border-success"
        >
          ▶️ Replay Stories
        </Button>
        <Button onclick={closeStory} variant="outline" class="bg-muted text-muted-foreground border-muted">
          Close
        </Button>
      </div>
    {:else}
      <!-- Story Viewer -->
      <div class="relative w-full max-w-sm h-full max-h-[700px] bg-gradient-to-b from-black/80 to-black/40 overflow-hidden flex flex-col">
        <!-- Progress Bars -->
        <div class="flex gap-0.5 p-4 absolute top-0 left-0 right-0 z-40">
          {#each $storiesData as _, index}
            <div class="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
              <div
                class="h-full bg-white transition-all duration-100 linear"
                style={index < currentStoryIndex
                  ? "width: 100%"
                  : index === currentStoryIndex
                    ? `width: ${storyProgress}%`
                    : "width: 0%"}
              ></div>
            </div>
          {/each}
        </div>

        <!-- Story Header -->
        <div class="flex items-center justify-between p-4 pt-16 relative z-30">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
              {formatBusinessName($storiesData[currentStoryIndex].business_slug).charAt(0)}
            </div>
            <div>
              <h3 class="text-white text-sm font-semibold">
                <a
                  href="/in/solar-panel-installer/{$storiesData[currentStoryIndex].business_slug}"
                  class="hover:text-secondary transition-colors"
                  onclick={closeStory}
                >
                  {formatBusinessName($storiesData[currentStoryIndex].business_slug)}
                </a>
              </h3>
            </div>
          </div>
          <Button
            onclick={closeStory}
            variant="ghost"
            size="sm"
            class="text-white hover:bg-white/20 h-8 w-8 p-0"
          >
            <X size={20} />
          </Button>
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
              alt={$storiesData[currentStoryIndex].title}
              class="w-full h-auto object-contain mt-4 max-h-[70vh]"
            />
          {:else}
            <div class="flex flex-col items-center justify-center gap-2 text-white/80">
              <span class="text-5xl">📸</span>
              <p>No image available</p>
            </div>
          {/if}
        </div>

        <!-- Story Details Overlay -->
        <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 z-30">
          <h2 class="text-white text-lg font-semibold mb-3">{$storiesData[currentStoryIndex].title}</h2>
          <div class="flex flex-col gap-2">
            <div class="flex items-center gap-2">
              <span class="text-white text-sm">📍 Location:</span>
              <span class="text-white font-medium text-sm">{$storiesData[currentStoryIndex].pincode || "N/A"}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-white text-sm">📅 Completed:</span>
              <span class="text-white font-medium text-sm">{formatDate($storiesData[currentStoryIndex].project_date)}</span>
            </div>
          </div>
        </div>

        <!-- Navigation Areas -->
        <button
          onclick={() => handleStoryClick("left")}
          disabled={currentStoryIndex === 0}
          class="absolute left-0 top-0 bottom-0 w-1/2 z-20 cursor-pointer disabled:cursor-not-allowed"
          aria-label="Previous story"
        ></button>
        <button
          onclick={() => handleStoryClick("right")}
          class="absolute right-0 top-0 bottom-0 w-1/2 z-20 cursor-pointer"
          aria-label="Next story"
        ></button>
      </div>
    {/if}
  </Dialog.Content>
</Dialog.Root>
