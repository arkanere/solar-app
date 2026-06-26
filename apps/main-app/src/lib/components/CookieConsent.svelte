<script lang="ts">
  import { onMount } from 'svelte';
  import { getConsent, setConsent } from '$lib/consent';

  // Called when the visitor accepts — the layout uses this to kick off the
  // (otherwise deferred) analytics scripts immediately.
  let { onAccept = () => {}, onDecline = () => {} }: {
    onAccept?: () => void;
    onDecline?: () => void;
  } = $props();

  let visible = $state(false);

  onMount(() => {
    // Only shown on the very first visit — once a choice exists it stays hidden.
    visible = getConsent() === null;
  });

  function accept() {
    setConsent('accepted');
    visible = false;
    onAccept();
  }

  function decline() {
    setConsent('declined');
    visible = false;
    onDecline();
  }
</script>

{#if visible}
  <div class="cookie-consent" role="dialog" aria-live="polite" aria-label="Cookie consent">
    <p class="cookie-consent__text">
      We use cookies and analytics to understand how visitors use Solar Vipani and
      to improve the site. You can accept or decline analytics cookies. See our
      <a href="/in/privacy-policy">Privacy Policy</a> for details.
    </p>
    <div class="cookie-consent__actions">
      <button type="button" class="cookie-consent__btn cookie-consent__btn--ghost" onclick={decline}>
        Decline
      </button>
      <button type="button" class="cookie-consent__btn cookie-consent__btn--primary" onclick={accept}>
        Accept
      </button>
    </div>
  </div>
{/if}

<style>
  /* Self-contained styling so the banner renders identically under both the
     Tailwind-based /in layout and the plain-CSS /us layout. */
  .cookie-consent {
    position: fixed;
    bottom: 1rem;
    left: 1rem;
    right: 1rem;
    z-index: 1000;
    max-width: 640px;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem 1rem;
    padding: 1rem 1.25rem;
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 0.625rem;
    background: #ffffff;
    color: #1a1a1a;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.18);
    font-size: 0.875rem;
    line-height: 1.5;
  }

  .cookie-consent__text {
    margin: 0;
    flex: 1 1 16rem;
  }

  .cookie-consent__text a {
    color: #0056b3;
    text-decoration: underline;
  }

  .cookie-consent__actions {
    display: flex;
    gap: 0.5rem;
    flex-shrink: 0;
  }

  .cookie-consent__btn {
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    border: 1px solid transparent;
    white-space: nowrap;
  }

  .cookie-consent__btn--primary {
    background: #0056b3;
    color: #ffffff;
  }

  .cookie-consent__btn--primary:hover {
    background: #00408a;
  }

  .cookie-consent__btn--ghost {
    background: transparent;
    color: #1a1a1a;
    border-color: rgba(0, 0, 0, 0.25);
  }

  .cookie-consent__btn--ghost:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  @media (prefers-color-scheme: dark) {
    .cookie-consent {
      background: #1f1f1f;
      color: #f5f5f5;
      border-color: rgba(255, 255, 255, 0.15);
    }
    .cookie-consent__text a {
      color: #66b2ff;
    }
    .cookie-consent__btn--ghost {
      color: #f5f5f5;
      border-color: rgba(255, 255, 255, 0.3);
    }
    .cookie-consent__btn--ghost:hover {
      background: rgba(255, 255, 255, 0.08);
    }
  }
</style>
