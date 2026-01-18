<script lang="ts">
  import LeadFormBusiness from "$lib/in-new-rewrites/LeadFormBusiness.svelte";

  interface Props {
    city: string;
    hasBusinesses: boolean;
  }

  let { city, hasBusinesses } = $props();

  const cityName = $derived(city.replace("-", " "));
</script>

<section id="lead-form-sv">
  {#if !hasBusinesses}
    <h2>Be the First to Get Quotes When Installers Join {cityName}</h2>
    <p class="lead-form-subtitle">
      Submit your requirements and we'll notify you as soon as verified installers
      become available in your area.
    </p>
  {:else}
    <h2>Quickly Get Quotation from 2-3 Verified Solar Installers in {cityName}</h2>
    <p class="privacy-note">
      Be assured, we follow highest privacy standards to keep your details safe.
      <a href="/privacy-policy">Learn more</a>
    </p>
  {/if}
  <LeadFormBusiness />
</section>

<style>
  #lead-form-sv {
    text-align: center;
    padding: 3rem 2rem;
    background: linear-gradient(135deg, #0056b3, #0a4b9e);
    color: white;
    max-width: 800px;
    margin: 0 auto;
    border-radius: 16px;
  }

  #lead-form-sv h2 {
    margin: 0 auto 1.5rem;
    font-size: 1.8rem;
    color: white;
    max-width: 800px;
  }

  .lead-form-subtitle {
    color: rgba(255, 255, 255, 0.9);
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }

  .privacy-note {
    color: rgba(255, 255, 255, 0.85);
    font-size: 0.95rem;
    margin-bottom: 1.5rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }

  .privacy-note a {
    color: rgba(255, 255, 255, 0.95);
    text-decoration: underline;
    font-weight: 500;
    transition: color 0.2s ease;
  }

  .privacy-note a:hover {
    color: white;
  }

  @media (max-width: 768px) {
    #lead-form-sv {
      padding: 2rem 1rem;
    }

    #lead-form-sv h2 {
      font-size: 1.4rem;
    }

    .lead-form-subtitle,
    .privacy-note {
      font-size: 1rem;
    }
  }
</style>
