<script>
  import { Calendar, MapPin } from 'lucide-svelte';
  import { onMount } from 'svelte';
  import Loader from '$lib/components/Loader.svelte';
    let data = []; 
    let isLoading = true;
    
    const tabulka = 'event'; //zde název tabulky
    const sloupce = ['title_cz', 'date', 'location', 'poster_url', 'ticket_url'];

    
    // Načtení dat z API
    onMount(async () => {
      const response = await fetch(`/api/get/${tabulka}`);
      if (response.ok) {
        data = await response.json();
      }
      isLoading = false;
    });

</script>



<div class="ticket-wrapper">
  <h1 style="margin-bottom: 100px; font-size:50px;">Vstupenky</h1>
  {#if isLoading}
    <Loader/>
  {:else if data.length === 0}
    <p>Žádné vstupenky nebyly nalezeny.</p>
  {:else}
    <div class="ticket-list">
    {#each data as d}
      <div class="ticket">
      <div class="ticket-left" 
      style="background-image: url({d.poster_url});"></div>
      <div class="ticket-right">
        <div>
          <div class="title">{d.title_cz}</div>
          <div class="subtitle">
            <Calendar size="16" style="vertical-align: middle; margin-right: 6px;" />
            {d.date}
          </div>
          <div class="subtitle">
            <MapPin size="16" style="vertical-align: middle; margin-right: 6px;" />
            {d.location}
          </div>
          <div class="links">
            <a class="link" href="{d.ticket_url}">Vstupenky zde</a>
          </div>
        </div>
        <div class="footer">
          <span>© 2025 Timegate</span>
        </div>
      </div>
    </div>
    {/each}
  </div>
  {/if}
</div>

<style>
  
.ticket-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 100px;
}

.ticket-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  justify-items: center;
}

.ticket {
  display: flex;
  width: 700px;
  background: #1e1f21;
  margin-bottom: 50px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.6);
  transition: transform 0.3s ease;
}

.ticket:hover {
    transform: translateY(-5px);
    box-shadow: 0 0 25px rgba(0, 0, 0, 0.6);
  }

.ticket-left {
  width: 300px;
  background: center/cover no-repeat;
}


.ticket-right {
  position: relative;
  flex: 1;
 background: #1a1a1a;
  color: #fff;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 0 16px 16px 0;
}

.title {
  font-size: 24px;
  font-weight: bold;
  text-align: right;
  line-height: 1.2;
}

.subtitle {
  font-size: 16px;
  text-align: right;
  margin-top: 10px;
}

.links {
  margin-top: 15px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.link {
  background-color: #fff;
  border-radius: 10px;
  color: #0d172a;
  font-size: 1rem;
  font-weight: 600;
  padding: 0.8rem 1.4rem;
  text-decoration: none;
  transition: background 0.2s ease;
}

.link:hover {
  background-color: #1e293b;
  color: #fff;
}

.footer {
  margin-top: 30px;
  font-size: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  padding-top: 10px;
  display: flex;
  justify-content: end;
  color: #f0dfff;
}



/* Responsivita */
@media (max-width: 767px) {
  .ticket {
    flex-direction: column;
    max-width: 400px;
  }

  .ticket-left {
    height: 250px;
    width: 100%;
  }

  .ticket-right {
    border-radius: 0 0 16px 16px;
    height: auto;
  }

  .title, .subtitle {
    text-align: center;
  }

  .links {
    justify-content: center;
  }

  .footer {
    gap: 0.5rem;
    text-align: center;
    margin-top: 20px;
  }
}
</style>
