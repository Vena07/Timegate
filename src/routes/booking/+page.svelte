<script>
  import { onMount } from 'svelte';
 import Loader from '$lib/components/Loader.svelte';
  let artists = [];
  let selectedArtist = null;
  let isLoading = true;

  
  function openDetail(artist) {
    selectedArtist = artist;
  }

  function closeDetail() {
    selectedArtist = null;
  }

  onMount(async () => {
    const response = await fetch('/api/get/artist');
    if (response.ok) {
      artists = await response.json();
    } else {
      console.error('Chyba při načítání umělců');
    }
    isLoading = false;
  });
</script>

<section class="booking-section">
  <h2>Booking</h2>

  {#if isLoading}
  <Loader/>
  {:else if !selectedArtist}
    <div class="category">
      <h3>RAVE</h3>
      <div class="grid">
        {#each artists.filter(a => a.category === 'RAVE') as artist}
          <div class="card" on:click={() => openDetail(artist)} role="button" tabindex="0">
            <img src={artist.photo_url} alt={artist.name} />
            <p>{artist.name}</p>
          </div>
        {/each}
      </div>

      <h3>SOUND</h3>
      <div class="grid">
        {#each artists.filter(a => a.category === 'SOUND') as artist}
          <div class="card" on:click={() => openDetail(artist)} role="button" tabindex="0">
            <img src={artist.photo_url} alt={artist.name} />
            <p>{artist.name}</p>
          </div>
        {/each}
      </div>
    </div>
  {:else}
    <div class="artist-detail">
      <img class="large-img" src={selectedArtist.photo_url} alt={selectedArtist.name} />
      <h2>{selectedArtist.name}</h2>
      <a style="color: white;" href="{selectedArtist.instagram_url}">Instagram</a>
      <p>{selectedArtist.bio_cz}</p>
      <button on:click={closeDetail}>← Zpět na přehled</button>
    </div>
  {/if}
</section>

<style>
  /* stejný styl jako jsi měl */
  .booking-section {
    padding: 4rem 1rem;
    color: white;
    text-align: center;
  }

  .booking-section h2 {
    font-size: 3rem;
    margin-bottom: 2rem;
    text-transform: uppercase;
  }

  .category h3 {
    font-size: 2rem;
    margin-top: 2rem;
    margin-bottom: 1rem;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    max-width: 1100px;
    margin: 0 auto 2rem;
  }

  .card {
    background: #1a1a1a;
    border-radius: 10px;
    padding: 1rem;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    outline: none;
  }

  .card:hover,
  .card:focus {
    transform: translateY(-5px);
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  }

 .card img {
    width: 230px;
    height: 230px;
    border-radius: 6px;
    object-fit: cover;

  }
  .card p {
    margin-top: 0.5rem;
    font-weight: 600;
  }

  .artist-detail {
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
    background: #1a1a1a;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 0 20px rgba(0,0,0,0.5);
  }

  .large-img {
    width: 500px;
    height: 500px;
    object-fit: cover;
    border-radius: 10px;
    margin-bottom: 1rem;
  }

  .artist-detail h2 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  .artist-detail p {
    font-size: 1rem;
    margin-bottom: 2rem;
  }

  .artist-detail button {
    display: inline-block;
    background-color: #fff;
    border-radius: 10px;
    color: #0d172a;
    font-size: 1rem;
    font-weight: 600;
    padding: 0.8rem 1.4rem;
    margin-top: 2rem;
    text-decoration: none;
    transition: background 0.2s ease;
    border: none;
  }

  .artist-detail button:hover {
    background-color: #1e293b;
    color: #fff;
  }

  @media screen and (max-width: 658px) {
    .booking-section h2 {
      font-size: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }

    .category h3 {
      font-size: 1.5rem;
    }

    .artist-detail h2 {
      font-size: 1.5rem;
    }

    .large-img {
    width: 250px;
    height: 250px;
    object-fit: cover;
    border-radius: 10px;
    margin-bottom: 1rem;
  }

    
  }
</style>
