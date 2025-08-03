<script>
  import { onMount } from 'svelte';

  let data = [];
  let novýZáznam = {};
  let upravenýZáznam = {};
  let idZáznamu = null;

  const tabulka = 'sound_track';
  const sloupce = ['title', 'soundcloud_url'];

  let chybyNovy = {};
  let chybyUprava = {};

  onMount(async () => {
    await načtiData();
  });

  async function načtiData() {
    const res = await fetch(`/api/${tabulka}`);
    if (res.ok) {
      data = await res.json();
    }
  }

  function validuj(dataObj, chybyObj) {
    chybyObj.title = !dataObj.title || dataObj.title.trim() === '' ? 'Povinný název' : null;
    chybyObj.soundcloud_url = !dataObj.soundcloud_url || dataObj.soundcloud_url.trim() === '' ? 'Povinná SoundCloud URL' : null;

    return !Object.values(chybyObj).some(Boolean);
  }

  async function vytvořitZáznam() {
    if (!validuj(novýZáznam, chybyNovy)) return;

    const res = await fetch(`/api/${tabulka}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: novýZáznam }),
    });
    if (res.ok) {
      novýZáznam = {};
      chybyNovy = {};
      await načtiData();
    }
  }

  async function upravitZáznam() {
    if (!validuj(upravenýZáznam, chybyUprava)) return;

    const res = await fetch(`/api/${tabulka}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: idZáznamu, data: upravenýZáznam }),
    });
    if (res.ok) {
      idZáznamu = null;
      upravenýZáznam = {};
      chybyUprava = {};
      await načtiData();
    }
  }

  async function smazatZáznam(id) {
    await fetch(`/api/${tabulka}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    await načtiData();
  }

  function nastavUpravu(záznam) {
    idZáznamu = záznam.id;
    upravenýZáznam = { ...záznam };
    chybyUprava = {};
  }
</script>

<div class="container">
  <h2>Soundtracky</h2>

  <h3>Nový záznam</h3>
  <div class="form-grid">
    <label>
      Název
      <input type="text" bind:value={novýZáznam.title} placeholder="Název skladby" class:error={chybyNovy.title} />
      {#if chybyNovy.title}<p class="error">{chybyNovy.title}</p>{/if}
    </label>

    <label>
      SoundCloud URL
      <input type="text" bind:value={novýZáznam.soundcloud_url} placeholder="https://soundcloud.com/..." class:error={chybyNovy.soundcloud_url} />
      {#if chybyNovy.soundcloud_url}<p class="error">{chybyNovy.soundcloud_url}</p>{/if}
    </label>
  </div>
  <button on:click={vytvořitZáznam}>Vytvořit</button>

  {#if idZáznamu}
    <h3>Upravit záznam</h3>
    <div class="form-grid">
      <label>
        Název
        <input type="text" bind:value={upravenýZáznam.title} placeholder="Název skladby" class:error={chybyUprava.title} />
        {#if chybyUprava.title}<p class="error">{chybyUprava.title}</p>{/if}
      </label>

      <label>
        SoundCloud URL
        <input type="text" bind:value={upravenýZáznam.soundcloud_url} placeholder="https://soundcloud.com/..." class:error={chybyUprava.soundcloud_url} />
        {#if chybyUprava.soundcloud_url}<p class="error">{chybyUprava.soundcloud_url}</p>{/if}
      </label>
    </div>
    <button on:click={upravitZáznam}>Upravit</button>
  {/if}

  <ul class="sound-list">
    {#each data as item}
      <li>
        <strong>{item.title}</strong>
        <a href={item.soundcloud_url} target="_blank" rel="noopener noreferrer" class="link">{item.soundcloud_url}</a>
        <div class="buttons">
          <button on:click={() => nastavUpravu(item)}>Upravit</button>
          <button on:click={() => smazatZáznam(item.id)}>Smazat</button>
        </div>
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

  input[type="text"] {
    background-color: #111;
    border: 1px solid #444;
    border-radius: 6px;
    padding: 0.5rem;
    color: #eee;
    font-family: var(--font-text);
    font-size: 1rem;
    transition: border-color 0.2s;
  }

  input[type="text"]:focus {
    border-color: #777;
    outline: none;
  }

  input.error {
    border-color: #ff5a5a;
  }

  .error {
    color: #ff5a5a;
    font-size: 0.85rem;
    margin-top: 0.3rem;
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

  .sound-list {
    margin-top: 2rem;
    list-style: none;
    padding: 0;
  }

  .sound-list li {
    background: #121212;
    border-radius: 10px;
    padding: 1rem;
    margin-bottom: 1rem;
    box-shadow: 0 0 8px #222;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .sound-list strong {
    font-family: var(--font-heading);
    font-size: 1.1rem;
  }

  .sound-list .link {
    color: #6ca0ff;
    text-decoration: underline;
    font-size: 0.9rem;
    word-break: break-all;
  }

  .buttons {
    margin-top: 0.6rem;
  }

  .buttons button {
    margin-right: 0.8rem;
    font-size: 0.9rem;
  }
</style>
