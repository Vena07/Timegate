<script>
  import { page } from '$app/stores';
  import CookieConsent from '$lib/components/CookieConsent.svelte';
  import CookieConsenten from '$lib/components/CookieConsenten.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import Header from '$lib/components/Header.svelte';
  import Footeren from '$lib/components/Footeren.svelte';
  import Headeren from '$lib/components/Headeren.svelte';
  import LanguageSwitch from '$lib/components/LanguageSwitch.svelte';

  $: isEnglish = $page.url.pathname.startsWith('/en');
</script>

<div class="layout">
  {#if isEnglish}
    <Headeren />
  {:else}
    <Header />
  {/if}

  <main>
    <slot />
  </main>

  <LanguageSwitch />

  {#if isEnglish}
    <Footeren />
  {:else}
    <Footer />
  {/if}

  {#if isEnglish}
     <CookieConsenten />
  {:else}
    <CookieConsent />
  {/if}

  
</div>


<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Orbitron:wght@600;800&display=swap');

  :global(:root) {
    --font-text: 'Inter', sans-serif;
    --font-heading: 'Orbitron', sans-serif;
  }

  :global(html, body) {
    margin: 0;
    padding: 0;
    height: 100%;
  }

  :global(body) {
    background-color: #0e0e0e;
  }

  .layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  main {
    flex: 1;
    font-family: var(--font-text);
    background-color: #0e0e0e;
    color: #eee;
  }

  :global(h1){
    font-family: var(--font-heading);
    letter-spacing: 1px;
    text-transform: uppercase;
    color: white;
  }

  :global(h2),
  :global(h3) {
    font-family: var(--font-heading);
    letter-spacing: 1px;
    text-transform: uppercase;
    color: white;
    margin: 3rem 0 1rem;
    text-transform: uppercase;
    border-bottom: 2px solid #444;
    padding-bottom: 0.3rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }

  :global(h1){
    font-size: clamp(1.8rem, 4vw, 2.8rem);
  }

  :global(h2){
    font-size: clamp(1.6rem, 3.5vw, 2.2rem);
  }

  :global(h3){
    font-size: clamp(1.3rem, 3vw, 1.8rem);
  }





  :global(a),
  :global(p),
  :global(div) {
    font-size: clamp(1rem, 2vw, 1.2rem);
    white-space: pre-line;
    font-family: var(--font-text);
  }
</style>
