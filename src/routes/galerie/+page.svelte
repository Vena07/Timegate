<script>
  import { onMount } from 'svelte';
  import Loader from '$lib/components/Loader.svelte';

  let data = [];
  let isLoading = true; 
  let selectedMedia = null; // pro obrázky i videa
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
      if (!result[title]) result[title] = [];
      result[title].push(item);
    }
    return result;
  }

  function isVideo(url) {
    return url.includes('streamable.com');
  }
</script>

<section class="gallery-page">
  <h1>Galerie</h1>

  {#if isLoading}
    <Loader />
  {:else if data.length === 0}
    <p>Žádné obrázky ani videa nebyly nalezeny.</p>
  {:else}
    {#each Object.entries(grouped) as [section, media]}
      <h2>{section}</h2>
      <div class="gallery-wrapper">
        <div class="gallery-slider">
          {#each media as d}
            <div
              class="media-item"
              on:click={() => selectedMedia = d.image_url}
              on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && (selectedMedia = d.image_url)}
              role="button"
              tabindex="0"
              aria-label="Zobrazit media"
            >
              {#if isVideo(d.image_url)}
                <iframe
                  src={d.image_url}
                  title="Video galerie"
                  frameborder="0"
                  allowfullscreen
                ></iframe>
              {:else}
                <img src={d.image_url} alt="Miniatura galerie" />
              {/if}
            </div>
          {/each}
        </div>
      </div>
    {/each}

    {#if selectedMedia}
      <div
        class="modal"
        role="button"
        tabindex="0"
        aria-label="Zavřít media"
        on:click={() => selectedMedia = null}
        on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && (selectedMedia = null)}
      >
        {#if isVideo(d.image_url)}
  <div class="video-wrapper">
    <iframe
      src={d.image_url}
      title="Video galerie"
      frameborder="0"
      allowfullscreen
    ></iframe>
  </div>
{:else}
  <img src={d.image_url} alt="Miniatura galerie" />
{/if}
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
  margin: 0 auto;
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

.media-item {
  flex: 0 0 auto;
  width: 300px;
  height: 200px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.6);
  cursor: pointer;
  scroll-snap-align: start;
  background: #111;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.media-item:hover {
  transform: scale(1.05);
}

.media-item img,
.media-item iframe {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
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
  padding: 1rem;
}
</style>
