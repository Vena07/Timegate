<script>
  import { onMount } from 'svelte';

  let sections = [];
  let gallery = [];

  let novaSekce = { title_cz: '', title_en: '' };
  let noveObrazky = {};

  onMount(async () => {
    await nactiSekce();
    await nactiGalerii();
  });

  async function nactiSekce() {
    const res = await fetch('/api/sections');
    if (res.ok) {
      sections = await res.json();
    }
  }

  async function nactiGalerii() {
    const res = await fetch('/api/gallery');
    if (res.ok) {
      gallery = await res.json();
    }
  }

  async function vytvoritSekci() {
    const res = await fetch('/api/sections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: novaSekce })
    });

    if (res.ok) {
      const nova = await res.json();
      sections = [...sections, nova];
      novaSekce = { title_cz: '', title_en: '' };
    } else {
      console.error('Chyba při vytváření sekce:', await res.text());
    }
  }

  async function vytvoritObrazek(sectionId) {
    const url = noveObrazky[sectionId];
    if (!url) return;

    const upravenyUrl = prevestGoogleDrive(url);

    // automatické upravení Streamable odkazu na embed
    let embedUrl = upravenyUrl;
    if (upravenyUrl.includes('streamable.com') && !upravenyUrl.includes('/o/')) {
      const match = upravenyUrl.match(/streamable.com\/([a-zA-Z0-9]+)/);
      if (match && match[1]) embedUrl = `https://streamable.com/o/${match[1]}`;
    }

    const res = await fetch('/api/gallery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: { image_url: embedUrl, section_id: sectionId } })
    });

    if (res.ok) {
      await nactiGalerii();
      noveObrazky[sectionId] = ''; // vyprázdnit input
    } else {
      console.error('Chyba při vytváření obrázku:', await res.text());
    }
  }

  function prevestGoogleDrive(url) {
    if (!url) return '';
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    return match && match[1]
      ? `https://drive.google.com/uc?export=view&id=${match[1]}`
      : url;
  }

  async function smazatSekci(id) {
    const res = await fetch(`/api/sections/${id}`, { method: 'DELETE' });
    if (res.ok) {
      sections = sections.filter(s => s.id !== id);
      gallery = gallery.filter(g => g.section_id !== id);
    } else {
      console.error('Chyba při mazání sekce:', await res.text());
    }
  }

  async function smazatObrazek(id) {
    const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
    if (res.ok) {
      gallery = gallery.filter(g => g.id !== id);
    } else {
      console.error('Chyba při mazání obrázku:', await res.text());
    }
  }
</script>

<div class="container">
  <h3>Vytvořit sekci</h3>
  <div class="event-form">
    <label>Název CZ:
      <input type="text" bind:value={novaSekce.title_cz} placeholder="Např. Buková" />
    </label>
    <label>Název EN:
      <input type="text" bind:value={novaSekce.title_en} placeholder="Např. Beech" />
    </label>
  </div>
  <button on:click={vytvoritSekci}>Vytvořit sekci</button>

  {#each sections as sekce}
    <div class="section">
      <h3>
        {sekce.title_cz} / {sekce.title_en}
        <button on:click={() => smazatSekci(sekce.id)} class="delete-section">Smazat sekci</button>
      </h3>

      <div class="event-form">
        <label>Obrázek / Video URL:
          <input type="text" bind:value={noveObrazky[sekce.id]} placeholder="Vlož URL obrázku nebo Streamable videa" />
        </label>
        <button on:click={() => vytvoritObrazek(sekce.id)}>Vytvořit</button>
      </div>

      <div class="gallery-row">
        {#each gallery.filter(g => g.section_id === sekce.id) as obrazek}
          <div class="media-wrap">
            {#if obrazek.image_url.includes('imgur.com')}
              <img src={obrazek.image_url} alt="obrázek" />
            {:else if obrazek.image_url.includes('streamable.com')}
              <iframe 
                src={obrazek.image_url} 
                frameborder="0" 
                allow="autoplay; fullscreen" 
                allowfullscreen
                title={`Video z galerie sekce ${sekce.title_cz}`}
              ></iframe>
            {:else}
              <a href={obrazek.image_url} target="_blank">{obrazek.image_url}</a>
            {/if}
            <button on:click={() => smazatObrazek(obrazek.id)} class="delete-btn">×</button>
          </div>
        {/each}
      </div>
    </div>
  {/each}
</div>

<style>
.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1rem;
  color: white;
}

h3 {
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 2rem;
}

.event-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

label {
  display: flex;
  flex-direction: column;
  font-size: 0.9rem;
  color: #ccc;
  text-transform: uppercase;
}

input[type="text"]{
  padding: 0.6rem;
  border: 1px solid #444;
  border-radius: 6px;
  background-color: #111;
  color: #eee;
  font-size: 1rem;
}

button {
  background: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95rem;
  margin-top: 0.5rem;
  transition: background 0.2s, transform 0.1s;
}

button:hover {
  background: #2c80b4;
  transform: scale(1.02);
}

.section {
  margin-top: 2rem;
  padding: 1rem;
  border: 1px solid #333;
  border-radius: 12px;
  background: #1a1a1a;
}

.gallery-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
}

.media-wrap {
  position: relative;
  display: inline-block;
}

.media-wrap img,
.media-wrap iframe {
  max-width: 150px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #444;
}

.delete-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  font-size: 14px;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.delete-section {
  background: #e74c3c;
  margin-left: 1rem;
}
</style>
