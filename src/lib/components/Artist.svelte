<script>
  import { onMount } from 'svelte';

  let data = [];
  let novýZáznam = {};
  let upravenýZáznam = {};
  let idZáznamu = null;

  const tabulka = 'artist';
  const sloupce = ['name', 'category', 'photo_url', 'bio_cz', 'bio_en', 'instagram_url', 'spotify_url', 'youtube_url', 'soundcloud_url'];

  // Převod Google Drive odkazu na přímý obrázek
  function převeďGoogleDriveOdkaz(url) {
    if (!url) return '';
    const regex = /\/d\/([a-zA-Z0-9_-]+)/;
    const match = url.match(regex);
    if (match && match[1]) {
      const id = match[1];
      return `https://drive.google.com/uc?export=view&id=${id}`;
    }
    return url;
  }

  // Načtení dat z API
  onMount(async () => {
    const response = await fetch(`/api/${tabulka}`);
    if (response.ok) {
      data = await response.json();
    }
  });

  // Vytvoření nového záznamu
  async function vytvořitZáznam() {
    if (novýZáznam.photo_url) {
      novýZáznam.photo_url = převeďGoogleDriveOdkaz(novýZáznam.photo_url);
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
      data = await response.json();
    }
  }

  // Aktualizace existujícího záznamu
  async function upravitZáznam() {
    if (upravenýZáznam.photo_url) {
      upravenýZáznam.photo_url = převeďGoogleDriveOdkaz(upravenýZáznam.photo_url);
    }

    const response = await fetch(`/api/${tabulka}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: idZáznamu, data: upravenýZáznam })
    });

    if (response.ok) {
      const upravený = await response.json();
      const index = data.findIndex(záznam => záznam.id === idZáznamu);
      data[index] = upravený;
      upravenýZáznam = {};
      idZáznamu = null;
    }
  }

  // Smazání záznamu
  async function smazatZáznam(id) {
    const response = await fetch(`/api/${tabulka}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });

    if (response.ok) {
      data = data.filter(záznam => záznam.id !== id);
    }
  }

  // Nastavení hodnot pro úpravu
  function nastavUpravu(záznam) {
    idZáznamu = záznam.id;
    upravenýZáznam = { ...záznam };
  }
</script>
 <h2>{tabulka}</h2>
<div class="container">
<div>
 

<h3>Vytvořit nový záznam</h3>

<label>Name:
<input type="text" bind:value={novýZáznam.name} placeholder="name" />
</label>
<label>Category:
<select bind:value={novýZáznam.category}>
  <option value="" disabled selected>Vyber kategorii</option>
  <option value="SOUND">SOUND</option>
  <option value="RAVE">RAVE</option>
</select>
</label>
<label>Photo_url:
<input type="text" bind:value={novýZáznam.photo_url} placeholder="photo_url" />
</label>
<label>Bio_cz:
<textarea bind:value={novýZáznam.bio_cz} placeholder="bio_cz"></textarea>
</label>
<label>Bio_en:
<textarea bind:value={novýZáznam.bio_en} placeholder="bio_en"></textarea>
</label>
<label>Instagram_url:
<input type="text" bind:value={novýZáznam.instagram_url} placeholder="instagram_url" />
</label>

<label>Youtube_url:
<input type="text" bind:value={novýZáznam.youtube_url} placeholder="youtube_url" />
</label>
<label>spotify_url:
<input type="text" bind:value={novýZáznam.spotify_url} placeholder="spotify_url" />
</label>
<label>soundcloud_url:
<input type="text" bind:value={novýZáznam.soundcloud_url} placeholder="soundcloud_url" />
</label>
<button on:click={vytvořitZáznam}>Vytvořit</button>
</div>
<div class="seznam">
<h2>Seznam</h2>
<ul>
  {#each data as záznam}
    <li>
      <span>{záznam.name}</span>
      <span>{záznam.category}</span>
      <img src="{záznam.photo_url}" alt="obr"/>
      <button on:click={() => nastavUpravu(záznam)}>Upravit</button>
      <button on:click={() => smazatZáznam(záznam.id)}>Smazat</button>
    </li>
  {/each}
</ul>
</div>
<div>
<h3>Upravit záznam</h3>
{#if idZáznamu}
  <form>
    <label>name:
    <input type="text" bind:value={upravenýZáznam.name} placeholder="name" />
    </label>
    <label>category:
    <select bind:value={upravenýZáznam.category}>
      <option value="" disabled>Vyber kategorii</option>
      <option value="SOUND">SOUND</option>
      <option value="RAVE">RAVE</option>
    </select>
    </label>
    <label>photo_url:
    <input type="text" bind:value={upravenýZáznam.photo_url} placeholder="photo_url" />
    </label>
    <label>bio_cz:
    <textarea bind:value={upravenýZáznam.bio_cz} placeholder="bio_cz"></label></textarea>
    </label>
    <label>bio_en:
    <textarea bind:value={upravenýZáznam.bio_en} placeholder="bio_en" ></textarea>
    </label>
    <label>instagram_url:
    <input type="text" bind:value={upravenýZáznam.instagram_url} placeholder="instagram_url" />
    </label>
    <label>Youtube_url:
    <input type="text" bind:value={upravenýZáznam.youtube_url} placeholder="youtube_url" />
    </label>
    <label>spotify_url:
    <input type="text" bind:value={upravenýZáznam.spotify_url} placeholder="spotify_url" />
    </label>
    <label>soundcloud_url:
    <input type="text" bind:value={upravenýZáznam.soundcloud_url} placeholder="soundcloud_url" />
      </label>
    <button on:click={upravitZáznam}>Upravit</button>
  </form>
{/if}
</div>
</div>
<style>
:global(body) {
  background-color: #0e0e0e;
  color: #eee;
  font-family: var(--font-text, "Inter", sans-serif);
  margin: 0;
  padding: 0;
  line-height: 1.6;
}

/* Layout */
.container {
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 1rem;
  padding: 2rem;
}

img{
  width: 200px;
}


/* Nadpisy */
h2, h3 {
  color: #fff;
  font-family: var(--font-heading, "Oswald", sans-serif);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 1.5rem 0 1rem;
}

h2 {
  font-size: 1.8rem;
  border-bottom: 2px solid #1a1a1a;
  padding-bottom: 0.4rem;
}

h3 {
  font-size: 1.3rem;
}
.seznam{
  width: 300px;
}

/* Seznam */
ul {
  list-style: none;
  padding: 0;
  margin: 1.5rem 0;
}

li {
  background: #181818;
  border: 1px solid #2a2a2a;
  padding: 1.2rem;
  margin-bottom: 1.2rem;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
  transition: transform 0.2s, border-color 0.2s;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

li:hover {
  transform: translateY(-3px);
  border-color: #3498db;
}

li span {
  font-size: 0.95rem;
  color: #ccc;
}

/* Tlačítka */
button {
  background: #3498db;
  color: #fff;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  transition: background 0.2s, transform 0.1s;
  margin-top: 0.5rem;
  align-self: flex-start;
}

button:hover {
  background: #2c80b4;
  transform: scale(1.03);
}

/* Formuláře */
label {
  display: flex;
  flex-direction: column;
  font-size: 0.9rem;
  color: #bbb;
  margin-bottom: 1rem;
  font-weight: 500;
}

input[type="text"],
select {
  padding: 0.6rem 0.8rem;
  border: 1px solid #333;
  border-radius: 8px;
  background-color: #111;
  color: #eee;
  font-size: 1rem;
  font-family: var(--font-text, "Inter", sans-serif);
  transition: border-color 0.2s, box-shadow 0.2s;
  width: 100%;
  box-sizing: border-box;
}

input[type="text"]:focus,
select:focus {
  border-color: #3498db;
  outline: none;
  box-shadow: 0 0 0 2px rgba(52,152,219,0.3);
}

textarea {
  resize: vertical;
  min-height: 100px;
  background: #111;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 0.6rem;
  color: #eee;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

input[type="text"],
textarea {
  padding: 0.6rem 0.8rem;
  border: 1px solid #333;
  border-radius: 8px;
  background-color: #111;
  color: #eee;
  font-size: 1rem;
  font-family: var(--font-text, "Inter", sans-serif);
  transition: border-color 0.2s, box-shadow 0.2s;
  width: 100%;
  box-sizing: border-box;
}

input[type="text"]:focus,
textarea:focus {
  border-color: #3498db;
  outline: none;
  box-shadow: 0 0 0 2px rgba(52,152,219,0.3);
}

/* Form wrapper */
form {
  background: #1a1a1a;
  padding: 1.5rem;
  border: 1px solid #2a2a2a;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.25);
  margin-top: 1rem;
}



</style>
