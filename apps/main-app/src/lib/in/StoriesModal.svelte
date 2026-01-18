<script>
  import {
    storiesModalOpen,
    storiesData,
    storiesLoading,
    storiesError,
    closeStoriesModal,
    loadStoriesData,
  } from "./storiesStore.js";
  import { PUBLIC_CLOUDINARY_CLOUD_NAME } from "$env/static/public";
  import { isDarkMode } from "$lib/themeStore.svelte";

  let darkMode = $derived($isDarkMode);

  let currentStoryIndex = $state(0);
  let storyProgress = $state(0);
  let progressInterval;
  let showViewAll = $state(false);

  // Story duration in milliseconds
  const STORY_DURATION = 5000;
  const PROGRESS_UPDATE_INTERVAL = 50;

  // Format business name from slug
  function formatBusinessName(slug) {
    if (!slug) return "Unknown";
    return slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  // Format date
  function formatDate(dateString) {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  // Get image URL for project
  function getImageUrl(project, size = "w_400,h_400") {
    if (project.cloudinary_public_id) {
      return `https://res.cloudinary.com/${PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_fill,${size},q_auto,f_auto/${project.cloudinary_public_id}`;
    } else if (project.image_url) {
      return project.image_url;
    }
    return null;
  }

  // Close story viewer
  function closeStory() {
    stopStoryProgress();
    showViewAll = false;
    currentStoryIndex = 0;
    storyProgress = 0;
    closeStoriesModal();
  }

  // Navigate to next story
  function nextStory() {
    if (currentStoryIndex < $storiesData.length - 1) {
      currentStoryIndex++;
      resetStoryProgress();
    } else {
      // All stories finished - show view all
      showViewAll = true;
      stopStoryProgress();
    }
  }

  // Navigate to previous story
  function previousStory() {
    if (currentStoryIndex > 0) {
      currentStoryIndex--;
      resetStoryProgress();
    }
  }

  // Start story progress timer
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

  // Stop story progress timer
  function stopStoryProgress() {
    if (progressInterval) {
      clearInterval(progressInterval);
      progressInterval = null;
    }
    storyProgress = 0;
  }

  // Reset story progress
  function resetStoryProgress() {
    stopStoryProgress();
    startStoryProgress();
  }

  // Handle keyboard navigation
  function handleKeydown(event) {
    if (!$storiesModalOpen) return;

    if (event.key === "Escape") {
      closeStory();
    } else if (event.key === "ArrowLeft") {
      previousStory();
    } else if (event.key === "ArrowRight") {
      nextStory();
    }
  }

  // Handle story area clicks for navigation
  function handleStoryClick(event, area) {
    event.preventDefault();
    if (area === "left") {
      previousStory();
    } else if (area === "right") {
      nextStory();
    }
  }

  // Auto-start stories when modal opens
  $effect(() => {
    if ($storiesModalOpen && $storiesData.length > 0 && !$storiesLoading) {
      showViewAll = false;
      currentStoryIndex = 0;
      setTimeout(() => {
        startStoryProgress();
      }, 300);
    }
  });

  // Load stories when modal opens
  $effect(() => {
    if ($storiesModalOpen && $storiesData.length === 0 && !$storiesLoading) {
      loadStoriesData();
    }
  });

  // Cleanup on component destroy
  $effect(() => {
    return () => {
      stopStoryProgress();
    };
  });
</script>

<svelte:window onkeydown={handleKeydown} />

{#if $storiesModalOpen}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="stories-modal-backdrop" role="button" onclick={closeStory} tabindex="0" onkeydown={(e) => e.key === 'Enter' && closeStory()}>
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="stories-modal-content" onclick={(e) => e.stopPropagation()}>
      {#if $storiesLoading}
        <div class="loading-container">
          <div class="loading-spinner"></div>
          <p>Loading stories...</p>
        </div>
      {:else if $storiesError}
        <div class="error-container">
          <p>Error: {$storiesError}</p>
          <button onclick={closeStory}>Close</button>
        </div>
      {:else if $storiesData.length === 0}
        <div class="no-stories-container">
          <p>No stories available at the moment.</p>
          <button onclick={closeStory}>Close</button>
        </div>
      {:else if showViewAll}
        <!-- View All Projects after stories finish -->
        <div class="view-all-container">
          <h2>You've seen all our latest solar stories!</h2>
          <a
            href="/in/recent-solar-installation-projects"
            class="view-all-btn"
            onclick={closeStory}
          >
            View All Solar Projects →
          </a>
          <button
            class="replay-btn"
            onclick={() => {
              showViewAll = false;
              currentStoryIndex = 0;
              startStoryProgress();
            }}
          >
            ▶️ Replay Stories
          </button>
          <button class="close-btn-alt" onclick={closeStory}>Close</button>
        </div>
      {:else}
        <!-- Story Viewer -->
        <!-- Progress Indicators -->
        <div class="progress-container">
          {#each $storiesData as _, index}
            <div class="progress-bar">
              <div
                class="progress-fill"
                class:completed={index < currentStoryIndex}
                class:active={index === currentStoryIndex}
                style={index === currentStoryIndex
                  ? `width: ${storyProgress}%`
                  : ""}
              ></div>
            </div>
          {/each}
        </div>

        <!-- Story Header -->
        <div class="story-header">
          <div class="story-info">
            <div class="installer-avatar">
              <span
                >{formatBusinessName(
                  $storiesData[currentStoryIndex].business_slug,
                ).charAt(0)}</span
              >
            </div>
            <div class="installer-details">
              <h3>
                <a
                  href="/in/solar-panel-installer/{$storiesData[
                    currentStoryIndex
                  ].business_slug}"
                  class="installer-link"
                  onclick={closeStory}
                >
                  {formatBusinessName(
                    $storiesData[currentStoryIndex].business_slug,
                  )}
                </a>
              </h3>
            </div>
          </div>
          <button
            class="close-btn"
            onclick={closeStory}
            aria-label="Close story">✕</button
          >
        </div>

        <!-- Story Image -->
        <div class="story-image-container">
          {#if getImageUrl($storiesData[currentStoryIndex])}
            <img
              src={getImageUrl($storiesData[currentStoryIndex], "w_800,h_800")}
              alt={$storiesData[currentStoryIndex].title}
              class="story-main-image"
            />
          {:else}
            <div class="story-no-image">
              <span>📸</span>
              <p>No image available</p>
            </div>
          {/if}
        </div>

        <!-- Story Details Overlay -->
        <div class="story-details">
          <h2>{$storiesData[currentStoryIndex].title}</h2>
          <div class="project-info">
            <div class="info-item">
              <span class="info-label">📍 Location:</span>
              <span class="info-value"
                >{$storiesData[currentStoryIndex].pincode || "N/A"}</span
              >
            </div>
            <div class="info-item">
              <span class="info-label">📅 Completed:</span>
              <span class="info-value"
                >{formatDate(
                  $storiesData[currentStoryIndex].project_date,
                )}</span
              >
            </div>
          </div>
        </div>

        <!-- Navigation Areas -->
        <button
          class="nav-area nav-left"
          onclick={(e) => handleStoryClick(e, "left")}
          disabled={currentStoryIndex === 0}
          aria-label="Previous story"
        ></button>
        <button
          class="nav-area nav-right"
          onclick={(e) => handleStoryClick(e, "right")}
          aria-label="Next story"
        ></button>
      {/if}
    </div>
  </div>
{/if}

<style>
  :root {
    --primary-color: #0056b3;
    --primary-hover: #004494;
    --primary-light: #e6f0ff;
    --secondary-color: #4caf50;
    --text-dark: #2c3e50;
    --text-medium: #546e7a;
    --text-light: #ecf0f1;
    --light-bg-color: #f8f9fa;
    --dark-bg-color: #1a202c;
    --border-radius-md: 8px;
    --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);
  }

  /* Modal Backdrop */
  .stories-modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.95);
    z-index: 2000;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* Modal Content */
  .stories-modal-content {
    position: relative;
    width: 100%;
    max-width: 400px;
    height: 100%;
    max-height: 700px;
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.4));
    border-radius: var(--border-radius-md);
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  /* Loading States */
  .loading-container,
  .error-container,
  .no-stories-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    gap: 1rem;
    padding: 2rem;
    color: white;
    text-align: center;
  }

  .loading-spinner {
    width: 50px;
    height: 50px;
    border: 4px solid rgba(255, 255, 255, 0.2);
    border-left-color: white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  /* Progress Indicators */
  .progress-container {
    display: flex;
    gap: 2px;
    padding: 1rem;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 10;
  }

  .progress-bar {
    flex: 1;
    height: 3px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 1.5px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: white;
    width: 0%;
    transition: width 0.1s linear;
  }

  .progress-fill.completed {
    width: 100% !important;
  }

  /* Story Header */
  .story-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 3.5rem 1rem 1rem;
    position: relative;
    z-index: 10;
  }

  .story-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .installer-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--primary-color);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 600;
    font-size: 1.1rem;
  }

  .installer-details h3 {
    color: white;
    font-size: 1rem;
    font-weight: 600;
    margin: 0;
  }

  .installer-link {
    color: white;
    text-decoration: none;
    transition: color 0.2s ease;
  }

  .installer-link:hover {
    color: #ffd700;
    text-decoration: underline;
  }

  .close-btn {
    width: 32px;
    height: 32px;
    border: none;
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    transition: background 0.2s ease;
  }

  .close-btn:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  /* Story Image */
  .story-image-container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: rgba(0, 0, 0, 0.3);
    min-height: 0;
    flex-grow: 1;
  }

  .story-main-image {
    width: 100%;
    height: auto;
    object-fit: contain;
    margin-top: 1rem;
    max-height: 70vh;
  }

  .story-no-image {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: rgba(255, 255, 255, 0.8);
    font-size: 3rem;
  }

  /* Story Details */
  .story-details {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
    padding: 3rem 1rem 1.5rem;
    color: white;
    z-index: 10;
  }

  .story-details h2 {
    font-size: 1.3rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  .project-info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .info-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .info-label {
    font-size: 0.9rem;
    opacity: 0.9;
  }

  .info-value {
    font-weight: 500;
    font-size: 0.9rem;
  }

  /* Navigation Areas */
  .nav-area {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 50%;
    background: transparent;
    border: none;
    cursor: pointer;
    z-index: 5;
  }

  .nav-left {
    left: 0;
  }

  .nav-right {
    right: 0;
  }

  .nav-area:disabled {
    cursor: not-allowed;
  }

  /* View All Container */
  .view-all-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    gap: 1.5rem;
    padding: 2rem;
    text-align: center;
    color: white;
  }

  .view-all-container h2 {
    font-size: 1.5rem;
    margin: 0;
  }

  .view-all-btn,
  .replay-btn,
  .close-btn-alt {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: var(--border-radius-md);
    font-weight: 500;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.3s ease;
    box-shadow: var(--shadow-lg);
  }

  .view-all-btn {
    background-color: var(--primary-color);
    color: white;
  }

  .view-all-btn:hover {
    background-color: var(--primary-hover);
    transform: translateY(-2px);
  }

  .replay-btn {
    background-color: var(--secondary-color);
    color: white;
  }

  .replay-btn:hover {
    background-color: #45a049;
    transform: translateY(-2px);
  }

  .close-btn-alt {
    background-color: #666;
    color: white;
  }

  .close-btn-alt:hover {
    background-color: #555;
    transform: translateY(-2px);
  }

  /* Responsive Design */
  @media (max-width: 480px) {
    .stories-modal-content {
      width: 100%;
      height: 100%;
      max-width: none;
      max-height: none;
      border-radius: 0;
    }

    .story-details h2 {
      font-size: 1.1rem;
    }
  }
</style>
