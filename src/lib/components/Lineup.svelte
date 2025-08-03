<script>
  import { onMount } from 'svelte';
  export let event_id;

  let lineupData = [];
  let novýZáznam = {
    artist_name: '',
    genre: '',
    time_range: ''
  };

  // Načti lineup podle event_id
  async function načístLineup() {
    const response = await fetch(`/api/lineup?event_id=${event_id}`);
    if (response.ok) {
      lineupData = await response.json();
    }
  }

  onMount(načístLineup);

  // Přidání nového záznamu
  async function přidatZáznam() {
    const response = await fetch('/api/lineup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: {
          ...novýZáznam,
          event_id
        }
      })
    });

    if (response.ok) {
      const nový = await response.json();
      lineupData.push(nový);
      novýZáznam = { artist_name: '', genre: '', time_range: '' };
    }
  }

  // Smazání záznamu
  async function smazatZáznam(id) {
    const response = await fetch('/api/lineup', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });

    if (response.ok) {
      lineupData = lineupData.filter(z => z.id !== id);
    }
  }
</script>

<h3>Lineup (event #{event_id})</h3>

<table>
  <thead>
    <tr>
      <th>Umělec</th>
      <th>Žánr</th>
      <th>Čas</th>
      <th>Akce</th>
    </tr>
  </thead>
  <tbody>
    {#each lineupData as záznam}
      <tr>
        <td>{záznam.artist_name}</td>
        <td>{záznam.genre}</td>
        <td>{záznam.time_range}</td>
        <td>
          <button on:click={() => smazatZáznam(záznam.id)}>Smazat</button>
        </td>
      </tr>
    {/each}
    <tr>
      <td><input type="text" bind:value={novýZáznam.artist_name} placeholder="Umělec" /></td>
      <td><input type="text" bind:value={novýZáznam.genre} placeholder="Žánr" /></td>
      <td><input type="text" bind:value={novýZáznam.time_range} placeholder="Čas (např. 20:00–21:00)" /></td>
      <td><button on:click={přidatZáznam}>Přidat</button></td>
    </tr>
  </tbody>
</table>
