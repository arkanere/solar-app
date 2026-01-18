<script lang="ts">
  import LeadFormModal from "$lib/in-new-rewrites/LeadFormModal.svelte";

  interface Props {
    isOpen: boolean;
    businessName: string;
    businessSlug: string;
    onClose: () => void;
  }

  let { isOpen, businessName, businessSlug, onClose } = $props();

  function preventClickPropagation(node) {
    const handleClick = (event) => event.stopPropagation();
    node.addEventListener("click", handleClick);
    return {
      destroy() {
        node.removeEventListener("click", handleClick);
      },
    };
  }

  function handleEscape(e) {
    if (e.key === "Escape") {
      onClose();
    }
  }
</script>

{#if isOpen}
  <div
    class="modal-overlay"
    onclick={onClose}
    onkeydown={handleEscape}
    role="button"
    tabindex="0"
    aria-label="Close modal"
  >
    <dialog class="modal" open aria-modal="true" use:preventClickPropagation>
      <button class="close-modal" onclick={onClose} aria-label="Close">
        &times;
      </button>
      <h2>Request a Free Quote from {businessName}</h2>
      <LeadFormModal {businessName} {businessSlug} />
    </dialog>
  </div>
{/if}

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    backdrop-filter: blur(3px);
  }

  .modal {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    max-width: 500px;
    width: 90%;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    position: relative;
  }

  .close-modal {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 5px;
    margin: 0;
    color: #2c3e50;
  }

  @media (max-width: 768px) {
    .modal {
      padding: 1.5rem;
    }
  }
</style>
