<script>
  import Event from '$lib/components/Event.svelte';
  import Artist from '$lib/components/Artist.svelte';
  import Gallery from '$lib/components/Gallery.svelte';
  import News from '$lib/components/News.svelte';
  import Sound from '$lib/components/Sound.svelte';

  export let data;
  const user = data?.props?.User1;

  async function logout() {
    await fetch('/logout', { method: 'POST' });
    window.location.href = '/login';
  }

  const components = {
    Event,
    Artist,
    Gallery,
    News,
    Sound
  };

  let activeComponent = 'Event';

  // Reaktivita v Svelte je automatická na přiřazení
  $: Component = components[activeComponent];
</script>

<div class="menu">
  {#each Object.keys(components) as comp}
    <button
      class:active={activeComponent === comp}
      onclick={() => { activeComponent = comp }}
    >
      {comp}
    </button>
  {/each}
  <button onclick={logout} style="background-color: red;">Logout</button>
</div>

{#if Component}
  <svelte:component this={Component} />
{/if}

<style>
  .menu {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    margin-top: 100px;
    justify-content: center;
  }

  button {
    padding: 0.5rem 1rem;
    cursor: pointer;
    background: #3498db;
    color: white;
    border: none;
    border-radius: 5px;
  }

  button.active {
    background: #003f66;
  }
</style>
