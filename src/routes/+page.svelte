<script>
  import { onMount } from 'svelte';
  import { Calendar, MapPin} from 'lucide-svelte';
  import Loader from '$lib/components/Loader.svelte';

  let novinky = [];
  let events = [];
  let galleryImages = [];
  let soundTracks = [];

  let loading = true;
  let vybranaNovinka = null;
  let sliderEl;
  let currentIndex = 0;

  async function fetchLatest() {
    loading = true;
    try {
      const res = await fetch('/api/latest');
      const data = await res.json();

      novinky = data.news;
      events = data.event;
      galleryImages = data.gallery.map(img => img.image_url || img.url);

      soundTracks = data.sound_track;
    } catch (e) {
      console.error('Chyba při načítání dat:', e);
    } finally {
      loading = false;
    }
  }

  function scrollToAkce() {
    const el = document.getElementById('akce');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  function autoSlide() {
    const slides = sliderEl?.children;
    if (slides && slides.length > 0) {
      currentIndex = (currentIndex + 1) % slides.length;
      sliderEl.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
  }

  function otevritModal(novinka) {
    vybranaNovinka = novinka;
  }

  function zavritModal() {
    vybranaNovinka = null;
  }

  onMount(() => {
    fetchLatest();
    const interval = setInterval(autoSlide, 4000);
    return () => clearInterval(interval);
  });
</script>

<!-- pak v HTML už jen kontroluj {#if loading} pro celý fetch -->



<!-- HERO -->
<section class="hero">
  <div class="hero-image"></div>
  <div class="hero-content">
   
    <img src="/image.png" alt="">
    <p>Tvoje noc, náš rave</p> 
    
    <button on:click={scrollToAkce}>Vstoupit</button>
  </div>
</section>

<!-- NOVINKY -->
<section class="novinky-section">
  <h2>Novinky</h2>

  {#if loading}
    <Loader/>
  {:else}
    <div class="novinky-grid">
      {#each novinky as novinka}
        <article class="novinka-karta" style="background-image: url({novinka.photo_url});">
          <h3>{novinka.title_cz}</h3>
          <p>{novinka.description_cz.slice(0, 100)}{novinka.description_cz.length > 100 ? '...' : ''}</p>
          <button  on:click={() => otevritModal(novinka)}>Zjistit více</button>
        </article>
      {/each}
    </div>
  {/if}
</section>


<!-- NOVINKY MODAL -->
{#if vybranaNovinka}
 <div
  class="modal"
  role="button"
  tabindex="0"
  aria-label="Zavřít modal"
  on:click={zavritModal}
  on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && zavritModal(e)}
>
  <div
  class="modal-content"
  role="button"
  tabindex="0"
  aria-label="Zavřít modal"
  on:click={zavritModal}
  on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && zavritModal(e)}
>
    <button
      class="close-btn"
      on:click={zavritModal}
      aria-label="Zavřít modal"
    >
      &times;
    </button>
    <h2>{vybranaNovinka.title_cz}</h2>
    <p class="modal-date">
      {new Date(vybranaNovinka.created_at).toLocaleDateString('cs-CZ')}
    </p>
    <p>{vybranaNovinka.description_cz}</p>
    <img
      src={vybranaNovinka.photo_url}
      alt={"Obrázek novinky " + vybranaNovinka.title_cz}
    />
  </div>
</div>

{/if}

<!-- AKCE -->
<section class="events-list" id="akce">
  <h2>Akce</h2>
  
  {#if loading}
    <Loader/>
  {:else}
    <div class="events-grid">
      {#each events as event}
        <article class="event-card">
          <img src={event.poster_url} alt={"Plakát akce " + event.title} class="poster" />
          <div class="event-info">
            <h2>{event.title}</h2>
            <p class="info-item"><Calendar size="30" /> <strong>Datum:</strong> {event.date}</p>
            <p class="info-item"><MapPin size="30" /> <strong>Místo:</strong> <a style="text-decoration: underline;" href="{event.location_url}">{event.location}</a></p>
            <a href={`/akce?id=${event.id}`} class="link">Zjistit více</a>
          </div>
        </article>
      {/each}
    </div>
  {/if}
</section>


<!-- GALERIE -->
<section class="gallery-section">
  <h2>Galerie</h2>

  {#if loading}
    <Loader/>
  {:else}
    <div class="slider-wrapper">
      <div class="slider" bind:this={sliderEl}>
        {#each galleryImages as image}
          <div class="slide" style="background-image: url({image});"></div>
        {/each}
      </div>
    </div>
    <a class="link" href="/galerie">Další fotky zde</a>
  {/if}
</section>


<!-- SOUND -->


  <section class="music-section" id="hudba">
  <h2>SOUND</h2>
  {#if loading}
    <Loader/>
  {:else}
    <div class="soundcloud-grid">
      {#each soundTracks as track}
        <div class="soundcloud-item">
          <iframe
          title="{track.title}"  
          width="100%"
            height="166"
            scrolling="no"
            frameborder="no"
            allow="autoplay"
            src={track.soundcloud_url}
          ></iframe>
          <p>{track.title}</p>
        </div>
      {/each}
    </div>
    <a class="link" href="https://soundcloud.com/timegate_sound?utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing">Další soundy zde</a>
  {/if}
</section>


<style>
  :global(body) {
    margin: 0;
    background: #121212;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: white;
  }
   .novinky-section {
    color: white;
    padding: 4rem 1rem;
    text-align: center;
    background-color: #1e1f21;
  }
 
  .novinky-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
  }
  .novinka-karta {
    background: #222;
    border-radius: 10px;
    padding: 1rem;
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .novinka-karta h3 {
    margin-bottom: 0.5rem;

  }
   .novinky-section h2 {
    
font-size: 3rem;
  }
  .novinka-karta p {
    flex-grow: 1;
  }


  /* MODAL */
  .modal {
    position: fixed;
    top: 0; left: 0;
    width: 100vw; height: 100vh;
    background: rgba(0,0,0,0.75);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }
  .modal-content {
    background: #111;
    border-radius: 10px;
    padding: 1.5rem;
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
    color: white;
    position: relative;
    margin: 0 20px;
  }
  .modal-content img {
    width: 100%;
    border-radius: 10px;
    margin-bottom: 1rem;
  }
  .modal-content h2 {
    margin-bottom: 0.25rem;
  }
  .modal-date {
    font-size: 0.9rem;
    color: #ccc;
    margin-bottom: 1rem;
  }
  .close-btn {
    
    top: 10px;
    right: 15px;
    background: transparent;
    border: none;
    font-size: 2rem;
    color: white;
    cursor: pointer;
  }

  .hero {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    display: flex;
    justify-content: center;
  }

  .hero img{
    width: auto;
    max-height: 300px;
  }

  .hero-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('/hero.JPG');
    backdrop-filter: blur(5100px);
    background-size: cover;
    background-position: center;
    filter: brightness(0.5);
    z-index: 1;
  }

  .hero-content {
    position: relative;
    z-index: 1;
    text-align: center;
    padding-top: 30vh;
  }

 
  p {
    margin-bottom: 2rem;
    font-weight: 300;
    letter-spacing: 2px;
  }

  .events-list {
    max-width: 1200px;
    margin: 3rem auto;
    padding: 0 1rem;
  }

  .events-list h2 {
    font-size: 3rem;
    margin-bottom: 2.5rem;
    text-transform: uppercase;
    text-align: center;
    letter-spacing: 3px;
    margin: none;
    padding: none;
    width: none;
  }

 .events-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 2fr));
    gap: 2rem;
    place-items: center;
    max-width: 1200px;
    margin: 0 auto;
  }


  .event-card {
    background: #1a1a1a;
    border-radius: 12px;
    padding: 1.5rem;
 box-shadow: 0 0 15px rgba(0, 0, 0, 0.6);
    display: flex;
    flex-direction: column;
    align-items: center;
    object-fit: cover;
    transition: transform 0.3s ease;
    width: 330px;
    height: 90%;
    margin: 40px 0;
  }

  .event-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 0 25px rgba(0, 0, 0, 0.6);
  }

  .poster {
    width: 100%;
    height: 300px; /* Fixní výška pro jednotnost */
    border-radius: 12px;
    margin-bottom: 1rem;
    object-fit: cover;
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
  }

  .event-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    text-align: center;
    width: 100%;
  }


  .event-info h2 {
    margin-bottom: 0.7rem;
    font-weight: 700;
  }

  .info-item {
    margin: 0.6rem 0;
    font-weight: 300;
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }
  .gallery-section {
    color: white;
    padding: 4rem 1rem;
    text-align: center;
    background-color: #1e1f21;
  }

  .gallery-section h2 {
    font-size: 3rem;
    margin-bottom: 2rem;
    text-transform: uppercase;
    letter-spacing: 2px;
  }

  .slider-wrapper {
    overflow: hidden;
    max-width: 1200px;
    margin: 0 auto;
    border-radius: 20px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.6);
  }

  .slider {
    display: flex;
    transition: transform 0.8s ease-in-out;
    width: 100%;
  }

  .slide {
    min-width: 100%;
    height: 60vh;
    background-size: cover;
    background-position: center;
  }

  .music-section {
    padding: 4rem 1rem;
    text-align: center;
    color: white;
  }

  .music-section h2 {
    font-size: 2.5rem;
    margin-bottom: 2rem;
    letter-spacing: 2px;
  }

  .soundcloud-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 2rem;
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .soundcloud-item {
    background: #1a1a1a;
    padding: 1rem;
    border-radius: 12px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.6);
    transition: transform 0.3s ease;
  }

  .soundcloud-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 0 25px rgba(0, 0, 0, 0.6);
  }

  .soundcloud-item p {
    margin-top: 1rem;
    font-weight: 300;
    font-size: 1rem;
  }

  .link,button {
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

  .link:hover,button:hover {
    background-color: #1e293b;
    color: #fff;
  }

  a {
    position: relative;
    margin: 0 10px;
    font-weight: 600;
    font-size: 1.1rem;
    color: white;
    text-decoration: none;
    padding-bottom: 5px;
    transition: color 0.3s ease;
    overflow: hidden;
  }

  .modal-content img{
    max-width: 400px;
    height: 90%;
    justify-content: center;
  }

</style>
