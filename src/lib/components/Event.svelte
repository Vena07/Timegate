<script>
  import { onMount } from 'svelte';

  let data = []; // events s lineup
  let novýZáznam = {}; // nový event
  let upravenýZáznam = {}; // úprava eventu
  let idZáznamu = null; // ID upravovaného eventu

  let novýLineup = {}; // nový řádek lineup
  let zobrazenýLineupEventId = null;

  onMount(async () => {
    await načtiData();
  });

  async function načtiData() {
    const res = await fetch('/api/event');
    if (res.ok) {
      data = await res.json();
    }
  }

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

  function handleFileChange(event, sloupec) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      novýZáznam[sloupec] = reader.result;
    };
    reader.readAsDataURL(file);
  }

  async function vytvořitZáznam() {
    // Pokud je poster_url string (Google Drive odkaz), převeď ho
    if (novýZáznam.poster_url && typeof novýZáznam.poster_url === 'string') {
      novýZáznam.poster_url = převeďGoogleDriveOdkaz(novýZáznam.poster_url);
    }

    const res = await fetch('/api/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: novýZáznam })
    });
    if (res.ok) {
      novýZáznam = {};   // vyčisti formulář
      await načtiData();
    }
  }

  async function upravitZáznam() {
    if (upravenýZáznam.poster_url && typeof upravenýZáznam.poster_url === 'string') {
      upravenýZáznam.poster_url = převeďGoogleDriveOdkaz(upravenýZáznam.poster_url);
    }

    const res = await fetch('/api/event', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: idZáznamu, data: upravenýZáznam })
    });
    if (res.ok) {
      idZáznamu = null;
      upravenýZáznam = {};
      await načtiData();
    }
  }

  async function smazatZáznam(id) {
    await fetch('/api/event', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    await načtiData();
  }

  function nastavUpravu(záznam) {
    idZáznamu = záznam.id;
    upravenýZáznam = { ...záznam };
    zobrazenýLineupEventId = záznam.id;
  }

  async function přidatLineup(event_id) {
    const body = {
      type: 'add_lineup',
      data: { ...novýLineup, event_id }
    };
    const res = await fetch('/api/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (res.ok) {
      novýLineup = {};
      await načtiData();
    }
  }

  async function smazatLineup(id) {
    await fetch('/api/event', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, type: 'delete_lineup' })
    });
    await načtiData();
  }
</script>
<h2>Eventy + lineup</h2>
<div class="container">
  
<div>
  <h3>Nový event</h3>
  <div class="event-form">
    <label>
      Název CZ
      <input type="text" bind:value={novýZáznam.title_cz} placeholder="Název v češtině" />
    </label>

    <label>
      Název EN
      <input type="text" bind:value={novýZáznam.title_en} placeholder="Název v angličtině" />
    </label>

    <label>
      Datum
      <input type="text" bind:value={novýZáznam.date} placeholder="2025-12-01" />
    </label>

    <label>
      Lokace
      <input type="text" bind:value={novýZáznam.location} placeholder="Praha, Brno..." />
    </label>

     <label>
        Lokace_URL
        <input type="text" bind:value={novýZáznam.location_url} placeholder="Google maps" />
      </label>

    <label>
      Photo_URL
      <input type="text" bind:value={novýZáznam.poster_url} placeholder="https://..." />
    </label>

    <label>
      Ticket URL
      <input type="text" bind:value={novýZáznam.ticket_url} placeholder="https://..." />
    </label>

    <label style="grid-column: 1 / -1;">
      Popis CZ
      <textarea bind:value={novýZáznam.description_cz} placeholder="Popis v češtině"></textarea>
    </label>

    <label style="grid-column: 1 / -1;">
      Popis EN
      <textarea bind:value={novýZáznam.description_en} placeholder="Popis v angličtině"></textarea>
    </label>
  </div>
  <button on:click={vytvořitZáznam}>Vytvořit</button>
  </div>

  <div>
  <ul>
    {#each data as event}
      <li>
        <strong>{event.title_cz}</strong> – {event.date} @ {event.location}<br />
        <small>{event.description_cz}</small>

        <div class="buttons">
          <button on:click={() => nastavUpravu(event)}>Upravit</button>
          <button on:click={() => smazatZáznam(event.id)}>Smazat</button>
        </div>

        {#if zobrazenýLineupEventId === event.id}
          <h4>Lineup</h4>
          <table>
            <thead>
              <tr>
                <th>Umělec</th>
                <th>Žánr</th>
                <th>Čas</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {#each event.lineup as row}
                <tr>
                  <td>{row.artist_name}</td>
                  <td>{row.genre}</td>
                  <td>{row.time_range}</td>
                  <td><button on:click={() => smazatLineup(row.id)}>Smazat</button></td>
                </tr>
              {/each}
            </tbody>
          </table>

          <h5>Přidat řádek do lineup</h5>
          <div class="lineup-inputs">
            <input type="text" bind:value={novýLineup.artist_name} placeholder="Umělec" />
            <input type="text" bind:value={novýLineup.genre} placeholder="Žánr" />
            <input type="text" bind:value={novýLineup.time_range} placeholder="Čas" />
          </div>
          <button on:click={() => přidatLineup(event.id)}>Přidat</button>
        {/if}
      </li>
    {/each}
  </ul>
  </div>
  <div>
  {#if idZáznamu}
    <h3>Upravit event</h3>
    <div class="event-form">
      <label>
        Název CZ
        <input type="text" bind:value={upravenýZáznam.title_cz} placeholder="Název v češtině" />
      </label>

      <label>
        Název EN
        <input type="text" bind:value={upravenýZáznam.title_en} placeholder="Název v angličtině" />
      </label>

      <label>
        Datum
        <input type="text" bind:value={upravenýZáznam.date} placeholder="2025-12-01" />
      </label>

      <label>
        Lokace
        <input type="text" bind:value={upravenýZáznam.location} placeholder="Praha, Brno..." />
      </label>
       <label>
        Lokace_URL
        <input type="text" bind:value={upravenýZáznam.location_url} placeholder="Google maps" />
      </label>

      <label>
        Poster URL
        <input type="text" bind:value={upravenýZáznam.poster_url} placeholder="https://..." />
      </label>

      <label>
        Ticket URL
        <input type="text" bind:value={upravenýZáznam.ticket_url} placeholder="https://..." />
      </label>

      <label style="grid-column: 1 / -1;">
        Popis CZ
        <textarea bind:value={upravenýZáznam.description_cz} placeholder="Popis v češtině"></textarea>
      </label>

      <label style="grid-column: 1 / -1;">
        Popis EN
        <textarea bind:value={upravenýZáznam.description_en} placeholder="Popis v angličtině"></textarea>
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
    display: flex;
    justify-content: space-evenly;
    
  }

  h2, h3, h4, h5 {
    color: white;
    margin-top: 2rem;
    font-family: var(--font-heading);
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 2rem 0;
  }

  li {
    background: #1a1a1a;
    border: 1px solid #333;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    transition: transform 0.2s;
  }

  li:hover {
    transform: translateY(-2px);
  }

  strong {
    font-size: 1.2rem;
    color: #fff;
  }

  small {
    display: block;
    margin-top: 0.5rem;
    color: #aaa;
  }

  .buttons {
    margin-top: 1rem;
    display: flex;
    gap: 0.5rem;
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
  }

  button:hover {
    background: #2c80b4;
    transform: scale(1.02);
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
    font-size: 0.95rem;
  }

  th, td {
    border: 1px solid #444;
    padding: 0.6rem;
    text-align: left;
  }

  th {
    background-color: #2a2a2a;
    color: #fff;
    font-weight: 600;
    font-family: var(--font-heading);
    text-transform: uppercase;
  }

  td {
    color: #ddd;
  }

  .event-form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin: 1.5rem 0;
  }

  .event-form label {
    display: flex;
    flex-direction: column;
    font-size: 0.95rem;
    color: #ccc;
  }

  .event-form textarea {
    resize: vertical;
    min-height: 80px;
    background: #222;
    border: 1px solid #444;
    border-radius: 6px;
    padding: 0.5rem;
    color: #eee;
  }


input[type="text"],
textarea{
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

  input[type="text"]:focus,
textarea:focus{
  border-color: #3498db;
  outline: none;
}

</style>
