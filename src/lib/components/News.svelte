<script>
  import { onMount } from 'svelte';

  let data = [];
  let novýZáznam = {};
  let upravenýZáznam = {};
  let idZáznamu = null;

  let chybyNovy = {};
  let chybyUprava = {};

  const sloupce = ['title_cz', 'title_en', 'description_cz', 'description_en', 'photo_url'];

  onMount(async () => {
    await načtiData();
  });

  async function načtiData() {
    const res = await fetch('/api/news');
    if (res.ok) {
      data = await res.json();
    }
  }

  function validuj(dataObj, chybyObj) {
    let validni = true;

    chybyObj.title_cz = !dataObj.title_cz || dataObj.title_cz.trim() === '' ? 'Povinné pole' : null;
    chybyObj.title_en = !dataObj.title_en || dataObj.title_en.trim() === '' ? 'Povinné pole' : null;
    chybyObj.description_cz = !dataObj.description_cz || dataObj.description_cz.trim() === '' ? 'Povinné pole' : null;
    chybyObj.description_en = !dataObj.description_en || dataObj.description_en.trim() === '' ? 'Povinné pole' : null;
    chybyObj.photo_url = !dataObj.photo_url || dataObj.photo_url.trim() === '' ? 'Obrázek je povinný' : null;

    for (const key in chybyObj) {
      if (chybyObj[key]) validni = false;
    }
    return validni;
  }

  function prevedGoogleDriveOdkaz(url) {
    if (!url) return '';
    const regex = /\/d\/([a-zA-Z0-9_-]+)/;
    const match = url.match(regex);
    if (match && match[1]) {
      const id = match[1];
      return `https://drive.google.com/uc?export=view&id=${id}`;
    }
    return url;
  }

  async function vytvořitZáznam() {
    if (!validuj(novýZáznam, chybyNovy)) return;

    // Převod odkazu na Google Drive přímý odkaz
    novýZáznam.photo_url = prevedGoogleDriveOdkaz(novýZáznam.photo_url);

    const res = await fetch('/api/news', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: novýZáznam })
    });
    if (res.ok) {
      novýZáznam = {};
      chybyNovy = {};
      await načtiData();
    }
  }

  async function upravitZáznam() {
    if (!validuj(upravenýZáznam, chybyUprava)) return;

    // Převod odkazu na Google Drive přímý odkaz
    upravenýZáznam.photo_url = prevedGoogleDriveOdkaz(upravenýZáznam.photo_url);

    const res = await fetch('/api/news', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: idZáznamu, data: upravenýZáznam })
    });
    if (res.ok) {
      idZáznamu = null;
      upravenýZáznam = {};
      chybyUprava = {};
      await načtiData();
    }
  }

  async function smazatZáznam(id) {
    await fetch('/api/news', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    await načtiData();
  }

  function nastavUpravu(záznam) {
    idZáznamu = záznam.id;
    upravenýZáznam = { ...záznam };
    chybyUprava = {};
  }

  function handleFileChange(event, targetObj) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      targetObj.photo_url = reader.result;
    };
    reader.readAsDataURL(file);
  }
</script>

 <h2>Novinky</h2>
<div class="container">
 
<div>
  <h3>Nový záznam</h3>
  <div class="form-grid">
    <label>
      Název CZ
      <input type="text" bind:value={novýZáznam.title_cz} placeholder="Název v češtině" class:error={chybyNovy.title_cz} />
      {#if chybyNovy.title_cz}<p class="error">{chybyNovy.title_cz}</p>{/if}
    </label>

    <label>
      Název EN
      <input type="text" bind:value={novýZáznam.title_en} placeholder="Název v angličtině" class:error={chybyNovy.title_en} />
      {#if chybyNovy.title_en}<p class="error">{chybyNovy.title_en}</p>{/if}
    </label>

    <label>
      Popis CZ
      <textarea bind:value={novýZáznam.description_cz} placeholder="Popis v češtině" class:error={chybyNovy.description_cz}></textarea>
      {#if chybyNovy.description_cz}<p class="error">{chybyNovy.description_cz}</p>{/if}
    </label>

    <label>
      Popis EN
      <textarea bind:value={novýZáznam.description_en} placeholder="Popis v angličtině" class:error={chybyNovy.description_en}></textarea>
      {#if chybyNovy.description_en}<p class="error">{chybyNovy.description_en}</p>{/if}
    </label>

    <label>
  Obrázek URL 
  <input type="text" bind:value={novýZáznam.photo_url} placeholder="URL obrázku" class:error={chybyNovy.photo_url} />
</label>
  </div>
  
  <button on:click={vytvořitZáznam}>Vytvořit</button>
  </div>
  
  <div>
  <ul class="news-list">
    {#each data as item}
      <li>
        <strong>{item.title_cz}</strong>
        <p>{item.description_cz}</p>
        {#if item.photo_url}
          <img src={item.photo_url} alt="obrázek" class="preview" />
        {/if}
        <div class="buttons">
          <button on:click={() => nastavUpravu(item)}>Upravit</button>
          <button on:click={() => smazatZáznam(item.id)}>Smazat</button>
        </div>
      </li>
    {/each}
  </ul>
  </div>
  <div>
  {#if idZáznamu}
    <h3>Upravit záznam</h3>
    <div class="form-grid">
      <label>
        Název CZ
        <input type="text" bind:value={upravenýZáznam.title_cz} placeholder="Název v češtině" class:error={chybyUprava.title_cz}>
        {#if chybyUprava.title_cz}<p class="error">{chybyUprava.title_cz}</p>{/if}
      </label>

      <label>
        Název EN
        <input type="text" bind:value={upravenýZáznam.title_en} placeholder="Název v angličtině" class:error={chybyUprava.title_en}>
        {#if chybyUprava.title_en}<p class="error">{chybyUprava.title_en}</p>{/if}
      </label>

      <label>
        Popis CZ
        <textarea bind:value={upravenýZáznam.description_cz} placeholder="Popis v češtině" class:error={chybyUprava.description_cz}></textarea>
        {#if chybyUprava.description_cz}<p class="error">{chybyUprava.description_cz}</p>{/if}
      </label>

      <label>
        Popis EN
        <textarea bind:value={upravenýZáznam.description_en} placeholder="Popis v angličtině" class:error={chybyUprava.description_en}></textarea>
        {#if chybyUprava.description_en}<p class="error">{chybyUprava.description_en}</p>{/if}
      </label>

      <label>
  Obrázek URL
  <input type="text" bind:value={upravenýZáznam.photo_url} placeholder="URL obrázku" class:error={chybyUprava.photo_url} />
</label>

    </div>
    <button on:click={upravitZáznam}>Upravit</button>
  {/if}
  </div>
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
    margin: 0 auto;
    padding: 2rem 1rem;
    display: flex;
    justify-content: space-around;
  }

  h2, h3 {
    color: white;
    margin-top: 2rem;
    font-family: var(--font-heading);
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .form-grid {
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
  }

  textarea {
    min-height: 100px;
    resize: vertical;
  }

  input[type="text"],
  textarea {
    background-color: #111;
    border: 1px solid #444;
    border-radius: 6px;
    padding: 0.5rem;
    color: #eee;
    font-family: var(--font-text);
    font-size: 1rem;
    transition: border-color 0.2s;
  }

  input[type="text"]:focus,
  textarea:focus{
    border-color: #777;
    outline: none;
  }

  .error {
    color: #ff5a5a;
    font-size: 0.85rem;
    margin-top: 0.3rem;
  }

  input.error,
  textarea.error{
    border-color: #ff5a5a;
  }

  button {
    background: linear-gradient(90deg, #4f75ff, #1f3d8f);
    border: none;
    color: white;
    padding: 0.6rem 1.4rem;
    font-weight: 600;
    border-radius: 7px;
    cursor: pointer;
    transition: background 0.3s;
    margin-top: 1rem;
  }

  button:hover {
    background: linear-gradient(90deg, #1f3d8f, #4f75ff);
  }

  .news-list {
    margin-top: 2rem;
    list-style: none;
    padding: 0;
  }

  .news-list li {
    background: #121212;
    border-radius: 10px;
    padding: 1rem;
    margin-bottom: 1rem;
    box-shadow: 0 0 8px #222;
  }

  .news-list strong {
    font-family: var(--font-heading);
    display: block;
    margin-bottom: 0.5rem;
  }

  .news-list img.preview {
    max-width: 150px;
    margin-top: 0.5rem;
    border-radius: 5px;
  }

  .buttons {
    margin-top: 0.8rem;
  }

  .buttons button {
    margin-right: 0.8rem;
    font-size: 0.9rem;
  }
</style>
