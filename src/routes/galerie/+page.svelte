<script>
  import { onMount } from 'svelte';
  import Loader from '$lib/components/Loader.svelte';

  let data = [];
  let isLoading = true; 
  let selectedImage = null;
  let grouped = {};

  onMount(async () => {
    const response = await fetch('/api/gallery');
    if (response.ok) {
      data = await response.json();
      grouped = groupBySection(data);
    }
    isLoading = false;
  });

  function groupBySection(items) {
    const result = {};
    for (const item of items) {
      const title = item.section_title || 'Nezařazeno';
      if (!result[title]) {
        result[title] = [];
      }
      result[title].push(item);
    }
    return result;
  }
</script>

<section class="gallery-page">
  <h1>Galerie</h1>
  {#if isLoading}
    <Loader />
  {:else if data.length === 0}
    <p>Žádné obrázky nebyly nalezeny.</p>
  {:else}
    {#each Object.entries(grouped) as [section, images]}
      <h2>{section}</h2>
      <div class="gallery-wrapper">
      <div class="gallery-slider">
        {#each images as d}
          <div
    on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && (selectedImage = null)}
    on:click={() => selectedImage = d.image_url}
     role="button"
      tabindex="0"
    aria-label={`Zobrazit obrázek číslo`}
    
  >
        <img src={d.image_url} alt={`Miniatura `} />
      </div>
        {/each}
      </div>
       </div>
    {/each}

    {#if selectedImage}
      <div
          class="modal"
          role="button"
          tabindex="0"
          aria-label="Zavřít obrázek"
          on:click={() => selectedImage = null}
          on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && (selectedImage = null)}
        >
        <img src={selectedImage} alt="Large view" />
      </div>
    {/if}
  {/if}
</section>

<style>
  .gallery-page {
    padding: 3rem 1rem;
    color: white;
    text-align: center;
  }

  h1 {
    font-size: 3rem;
    margin-bottom: 2rem;
    text-transform: uppercase;
    letter-spacing: 2px;
  }

  h2 {
    
    margin: 3rem 0 1rem;
    text-transform: uppercase;
    border-bottom: 2px solid #444;
    padding-bottom: 0.3rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }
.gallery-wrapper {
  max-width: 1000px;
  margin: 0 auto; /* střed wrapperu */
  overflow-x: auto;
  padding-bottom: 1rem;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
}

.gallery-slider {
  display: flex;
  gap: 1.2rem;
  justify-content: center;
  min-width: max-content; 
}


  .gallery-slider img {
    flex: 0 0 auto;
    width: 260px;
    height: 180px;
    object-fit: cover;
    border-radius: 12px;
    cursor: pointer;
    transition: transform 0.3s ease;
    scroll-snap-align: start;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.6);
  }

  .gallery-slider img:hover {
    transform: scale(1.05);
  }

  .gallery-wrapper::-webkit-scrollbar {
    height: 8px;
  }

  .gallery-wrapper::-webkit-scrollbar-thumb {
    background: #444;
    border-radius: 4px;
  }

  .gallery-wrapper::-webkit-scrollbar-track {
    background: #1a1a1a;
  }

  .modal {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
    cursor: pointer;
  }

  .modal img {
    max-width: 70vw;
    max-height: 70vh;
    border-radius: 16px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.6);
  }
</style>
