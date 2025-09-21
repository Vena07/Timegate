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

  async function upravitLineupRow(eventId, index) {
  const row = data.find(e => e.id === eventId).lineup[index];
  await fetch('/api/event', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'update_lineup', id: row.id, data: row })
  });
  await načtiData();
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
      Homepage poster: 330x500
      <input type="text" bind:value={novýZáznam.poster_url} placeholder="https://..." />
    </label>
      <label>
      Eventy poster/ticket: 300x300
      <input type="text" bind:value={novýZáznam.ticketpic_url} placeholder="https://..." />
    </label>
      <label>
      Eventy modal banner: 790x 400
      <input type="text" bind:value={novýZáznam.bannerpic_url} placeholder="https://..." />
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

  <div class="seznam">
  <ul>
    {#each data as event}
      <li>
        <strong>{event.title_cz}</strong> – {event.date} @ {event.location}<br />
        <small>{event.description_cz}</small>

        <div class="buttons">
          <button on:click={() => nastavUpravu(event)}>Upravit event</button>
          <button on:click={() => smazatZáznam(event.id)}>Smazat event</button>
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
              {#each event.lineup as row, index}
                <tr>
                  <td><input type="text" bind:value={event.lineup[index].artist_name} /></td>
                  <td><input type="text" bind:value={event.lineup[index].genre} /></td>
                  <td><input type="text" bind:value={event.lineup[index].time_range} /></td>
                  <td>
                    <button on:click={() => upravitLineupRow(event.id, index)}>Upravit</button>
                    <button on:click={() => smazatLineup(row.id)}>Smazat</button>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>

          <div class="lineup-inputs">
            <input type="text" bind:value={novýLineup.artist_name} placeholder="Umělec" />
            <input type="text" bind:value={novýLineup.genre} placeholder="Žánr" />
            <input type="text" bind:value={novýLineup.time_range} placeholder="Čas" />
            <button on:click={() => přidatLineup(event.id)}>Přidat</button>
          </div>
        {/if}
      </li>
    {/each}
  </ul>
</div>

  <div>
 
    <h3>Upravit event</h3> {#if idZáznamu}
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
        Homepage poster: 330x500
        <input type="text" bind:value={upravenýZáznam.poster_url} placeholder="https://..." />
      </label>
       <label>
        Eventy poster/ticket: 300x300
        <input type="text" bind:value={upravenýZáznam.ticketpic_url} placeholder="https://..." />
      </label>
       <label>
        Eventy modal banner: 790x 400
        <input type="text" bind:value={upravenýZáznam.bannerpic_url} placeholder="https://..." />
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

.seznam{
  width: 500px;
}

/* Nadpisy */
h2, h3, h4 {
  color: #fff;
  font-family: var(--font-heading, "Oswald", sans-serif);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 1.5rem 0 1rem;
}

h2 {
  font-size: 2rem;
  border-bottom: 2px solid #3498db;
  padding-bottom: 0.5rem;
}

h3 {
  font-size: 1.4rem;
}

h4 {
  font-size: 1.1rem;
  margin-top: 1.5rem;
}

/* Seznam eventů */
ul {
  list-style: none;
  padding: 0;
  margin: 2rem 0;
}

li {
  background: #181818;
  border: 1px solid #2a2a2a;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  transition: transform 0.2s, border-color 0.2s;
}

li:hover {
  transform: translateY(-3px);
  border-color: #3498db;
}

strong {
  font-size: 1.2rem;
  color: #fff;
}

small {
  display: block;
  margin-top: 0.5rem;
  color: #aaa;
  font-size: 0.9rem;
}

/* Tlačítka */
button {
  background: #3498db;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  transition: background 0.2s, transform 0.1s;
}

button:hover {
  background: #2c80b4;
  transform: scale(1.03);
}

.buttons {
  margin-top: 1rem;
  display: flex;
  gap: 0.8rem;
}

/* Formuláře */
.event-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.2rem;
  margin: 1.5rem 0;
}

.event-form label {
  display: flex;
  flex-direction: column;
  font-size: 0.95rem;
  color: #ccc;
  font-weight: 500;
}

.event-form textarea {
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

/* Tabulky */
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  font-size: 0.95rem;
  border-radius: 8px;
  overflow: hidden;
}

th, td {
  border: 1px solid #333;
  padding: 0.75rem;
  text-align: left;
}

th {
  background-color: #222;
  color: #fff;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

td {
  color: #ddd;
}

/* Lineup inputy */
.lineup-inputs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-top: 0.8rem;
}

.lineup-inputs input {
  flex: 1;
}



</style>