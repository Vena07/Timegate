<script>
  import { onMount } from 'svelte';
  import Loader from '$lib/components/Loader.svelte';

  let data = [];
  let isLoading = true; 
  let selectedImage = null;

  const tabulka = 'gallery';
  const sloupce = ['image_url'];

  onMount(async () => {
    const response = await fetch(`/api/get/${tabulka}`);
    if (response.ok) {
      data = await response.json();
    }
    isLoading = false;
  });
</script>


<section class="gallery-page">
  <h1>Gallery</h1>
  {#if isLoading}
    <Loader/>
  {:else if data.length === 0}
    <p>Žádné obrázky nebyly nalezeny.</p>
  {:else}
  <div class="gallery-grid">
    {#each data as d}
      <img src={d.image_url} alt="Photo" on:click={() => selectedImage = d.image_url} />
    {/each}
  </div>

  {#if selectedImage}
    <div class="modal" on:click={() => selectedImage = null}>
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

  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 1.5rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  .gallery-grid img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 12px;
    cursor: pointer;
    transition: transform 0.3s ease;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.6);
  }

  .gallery-grid img:hover {
    transform: scale(1.05);
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
    max-width: 90vw;
    max-height: 90vh;
    border-radius: 16px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.6);
  }
</style>
