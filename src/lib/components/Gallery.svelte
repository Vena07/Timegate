<script>
  import { onMount } from 'svelte';

  let data = [];
  let novýZáznam = {};
  let idZáznamu = null;

  const tabulka = 'gallery';
  const sloupce = ['image_url'];

  // Načíst existující záznamy
  onMount(async () => {
    const response = await fetch(`/api/${tabulka}`);
    if (response.ok) {
      data = await response.json();
    }
  });
  async function načtiData() {
  const res = await fetch('/api/gallery');
  if (res.ok) {
    data = await res.json();
  }
}

  // Vytvořit nový záznam
 async function vytvořitZáznam() {
  if (novýZáznam.image_url) {
    novýZáznam.image_url = převeďGoogleDriveOdkaz(novýZáznam.image_url);
  }
  const response = await fetch(`/api/${tabulka}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: novýZáznam })
  });

  if (response.ok) {
    const nový = await response.json();
    data.push(nový);
    novýZáznam = {};
    await načtiData();
  } else {
    console.error('Chyba při vytváření:', await response.text());
  }
}


  // Smazat záznam
  async function smazatZáznam(id) {
    const response = await fetch(`/api/${tabulka}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });

    if (response.ok) {
      data = data.filter(z => z.id !== id);
    }
  }

  function převeďGoogleDriveOdkaz(url) {
  if (!url) return '';
  const regex = /\/d\/([a-zA-Z0-9_-]+)/;
  const match = url.match(regex);
  if (match && match[1]) {
    return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }
  return url; // fallback
}

</script>

<div class="container">
  <h2>{tabulka} – Seznam obrázků</h2>

  <h3>Vytvořit nový záznam</h3>
<div class="event-form">
  {#each sloupce as sloupec}
    <label>Obrázek URL:
      <input type="text" bind:value={novýZáznam[sloupec]} placeholder="Vlož URL" />
    </label>
  {/each}
</div>
<button on:click={vytvořitZáznam}>Vytvořit</button>


  <ul>
    {#each data as záznam}
      <li>
        {#each sloupce as sloupec}
          <img src={záznam[sloupec]} alt="obrázek" />
        {/each}
        <button on:click={() => smazatZáznam(záznam.id)}>Smazat</button>
      </li>
    {/each}
  </ul>
</div>

<style>
:global(body) {
  background-color: #0e0e0e;
  color: #eee;
  font-family: var(--font-text);
  margin: 0;
  padding: 0;
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

h2, h3 {
  color: white;
  margin-top: 2rem;
  font-family: var(--font-heading);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.event-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin: 1.5rem 0;
}

label {
  display: flex;
  flex-direction: column;
  font-size: 0.9rem;
  color: #ccc;
  text-transform: uppercase;
}

button {
  background: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95rem;
  transition: background 0.2s, transform 0.1s;
  margin-top: 1rem;
}

button:hover {
  background: #2c80b4;
  transform: scale(1.02);
}

ul {
  list-style: none;
  padding: 0;
  margin-top: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
}

li {
  background: #1a1a1a;
  border: 1px solid #333;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  transition: transform 0.2s;
}

li:hover {
  transform: translateY(-2px);
}

li img {
  max-width: 100%;
  max-height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 0.8rem;
  border: 1px solid #444;
}


input[type="text"]{
  padding: 0.6rem;
  border: 1px solid #444;
  border-radius: 6px;
  background-color: #111;
  color: #eee;
  font-size: 1rem;
  font-family: var(--font-text);
  transition: border-color 0.2s;
  width: 95%;
}

</style>

