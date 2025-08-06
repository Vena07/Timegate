
<script>
  import { Calendar, MapPin } from 'lucide-svelte';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';

  let events = [];
  let selectedEvent = null;

  $: queryId = $page.url.searchParams.get('id');
  $: selectedEvent = events.find(e => e.id == queryId);

  onMount(async () => {
    const [eventRes, lineupRes] = await Promise.all([
      fetch('/api/get/event'),
      fetch('/api/get/lineup')
    ]);

    const [eventData, lineupData] = await Promise.all([
      eventRes.json(),
      lineupRes.json()
    ]);

    // Spojení lineupů do každého eventu
    events = eventData.map(event => {
      return {
        ...event,
        lineup: lineupData.filter(line => line.event_id === event.id)
      };
    });
  });

  function openDetail(event) {
    selectedEvent = event;
    history.replaceState(null, '', `?id=${event.id}`);
  }

  function closeDetail() {
    selectedEvent = null;
    history.replaceState(null, '', window.location.pathname);
  }
</script>


<section class="akce-section">
  <h1>Akce</h1>

  {#if !selectedEvent}
    <div class="events-grid">
      {#each events as event}
        <div class="event-card">
          <img class="poster" src={event.poster_url} alt={"Plakát akce " + event.title} />
          <h3>{event.title_cz}</h3>
          <p><Calendar class="icon" /> {event.date}</p>
          <p><MapPin class="icon" /> <a style="text-decoration: underline;" href="{event.location_url}"> {event.location}</a></p>
          <button on:click={() => openDetail(event)}>Zjistit více</button>
        </div>
      {/each}
    </div>
  {:else}
    <div class="event-detail">
      <img src={selectedEvent.poster_url} alt="Plakát" class="modal-image" />
      <h2>{selectedEvent.title_cz}</h2>
      <h3> <Calendar class="icon" /> Datum</h3> <p>{selectedEvent.date}</p>
      <h3><MapPin class="icon" /> Místo</h3><p><a href="{selectedEvent.location_url}">{selectedEvent.location}</a></p>

      <section class="bio-section">
        <h3>O akci</h3>
        <p>{selectedEvent.description_cz}</p>
      </section>

      <section class="lineup-section">
        <h3>Program / Line-up</h3>
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Čas</th>
                <th>DJ</th>
                <th>Žánr</th>
              </tr>
            </thead>
            <tbody>
              {#each selectedEvent.lineup as item}
                <tr>
                  <td>{item.time_range}</td>
                  <td>{item.artist_name}</td>
                  <td>{item.genre}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </section>

      <div class="links">
        <a class="link" href={selectedEvent.ticketUrl} target="_blank" rel="noopener noreferrer">
          Koupit vstupenku
        </a>
        <button on:click={closeDetail}>← Zpět na všechny akce</button>
      </div>
    </div>
  {/if}
</section>

<style>
  .akce-section {
    padding: 4rem 1rem;
    text-align: center;
    color: white;
    margin-top: 50px;
  }

  .akce-section h2 {
    font-size: 3rem;
    margin-bottom: 2rem;
    letter-spacing: 2px;
    text-transform: uppercase;
  }

  .events-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    max-width: 1100px;
    margin: 0 auto;
  }

  .event-card {
    background: #1a1a1a;
    border-radius: 12px;
    padding: 1rem;
     box-shadow: 0 0 15px rgba(0, 0, 0, 0.6);
    transition: transform 0.3s ease;
  }

  .event-card:hover {
    transform: translateY(-5px);
  }

  .poster {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 10px;
    margin-bottom: 1rem;
  }

  .event-card h3 {
    margin: 0.5rem 0;
    font-weight: 600;
  }

  .event-card p {
    font-weight: 300;
    margin: 0.2rem 0;
     
  }


  

  .event-detail {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem 1rem;
    background: #1a1a1a;
    border-radius: 12px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.6);
  }
   
  .event-detail h3,.event-detail p {
   border: none;
   text-align: start;
   max-width:none;
  }
  
  
  

  .event-detail h2 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  .event-detail .modal-image {
    width: 100%;
    border-radius: 10px;
    max-height: 400px;
    object-fit: cover;
    margin-bottom: 1rem;
  }

  .bio-section,
  .lineup-section {
    margin-bottom: 2rem;
  }

  .bio-section h3,
  .lineup-section h3 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }

  .bio-section p {
    font-size: 1rem;
    line-height: 1.5;
  }

  .table-wrapper {
    overflow-x: auto;
    width: 100%;
  }

  .table-wrapper table {
    min-width: 600px; /* nebo více, podle obsahu */
  }


  table {
    width: 100%;
    border-collapse: collapse;
    background: #222;
    border-radius: 8px;
    overflow: hidden;
  }

  th, td {
    padding: 0.8rem 1rem;
    border-bottom: 1px solid #444;
    text-align: left;
  }

  th {
    background: #333;
  }

  tr:hover {
    background: #2d2d2d;
  }

  .links {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .link {
    display: inline-block;
    background-color: #fff;
    border-radius: 1.5rem;
    color: #0d172a;
    font-size: 1rem;
    font-weight: 600;
    padding: 0.8rem 1.4rem;
    text-decoration: none;
    transition: background 0.2s ease;
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
  @media screen and (max-width: 768px) {
  .akce-section {
    padding: 2rem 1rem;
  }

  .akce-section h2 {
    font-size: 2rem;
  }

  .event-card h3 {
    font-size: 1.2rem;
  }

  .event-card p {
    font-size: 0.85rem;
  }

  .event-card button {
    font-size: 0.9rem;
    padding: 0.6rem 1.2rem;
  }

  .event-detail {
    padding: 1.5rem 1rem;
  }

  .event-detail h2 {
    font-size: 1.5rem;
  }

  .bio-section h3,
  .lineup-section h3 {
    font-size: 1.2rem;
  }

  .bio-section p{
    font-size: 0.95rem;
  }

  th, td {
    font-size: 0.85rem;
    padding: 0.5rem 0.8rem;
  }

  .link, .links button {
    font-size: 0.9rem;
    padding: 0.6rem 1.2rem;
  }
}

</style>
