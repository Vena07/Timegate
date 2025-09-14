<script>
  import { onMount } from "svelte";
  import { Hamburger } from 'svelte-hamburgers';
  import { fly } from 'svelte/transition';
  import { page } from '$app/stores';  // store s aktuální URL

  let open = false;
  let scrollY = 0;

  onMount(() => {
    const onScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener("scroll", onScroll);
    scrollY = window.scrollY;

    return () => window.removeEventListener("scroll", onScroll);
  });

  $: scrolled = scrollY > 50 || open;

  function closeMenu() {
    open = false;
  }

  const links = [
    { name: "Home", url: "/" },
    { name: "Akce", url: "/akce" },
    { name: "Vstupenky", url: "/vstupenky" },
    { name: "Galerie", url: "/galerie" },
    { name: "Booking", url: "/booking" },
    { name: "Kontakt", url: "/kontakt" }
  ];
</script>

<header class:scrolled>
  <div class="container">
    <div class="logo-container">
      <a href="/" class="logo-img"><img src="/image.png" alt=""></a> 
    </div>

    <!-- Desktop menu -->
    <nav class="nav-links">
      {#each links as {name, url}}
        <a 
          href={url} 
          class:selected={$page.url.pathname === url} 
          on:click={closeMenu}
        >
          {name}
        </a>
      {/each}
    </nav>

    <!-- Mobile hamburger -->
    <div class="hamburger-wrapper">
      <Hamburger bind:open --color="white" />
    </div>
  </div>

  {#if open}
    <div class="menu">
      {#each links as { name, url }, i}
          <a 
            href={url} 
            transition:fly={{ y: -15, delay: 50 * i }}
            class:selected={$page.url.pathname === url} 
            on:click={closeMenu}
          >
            {name}
          </a>
      {/each}
    </div>
  {/if}
</header>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Orbitron:wght@600;800&display=swap');

  
    img {
      height: 50px;
      width: auto;
      object-fit: contain;
      display: block;
      margin: 0;
    }

  
  
  :root {
    --color-primary: white; 
    --color-primary-dark: white;
    --bg-transparent: rgba(14, 14, 14, 0);
    --bg-scrolled: rgba(14, 14, 14, 0.9);
    --purple: rgb(78, 77, 78);
    --font-text: 'Inter', sans-serif;
    --font-heading: 'Orbitron', sans-serif;
  }

  

  a.selected {
    font-weight: 700;
    border-bottom: 2px solid var(--purple);
  }
  
 
  header {
    position: fixed;
    top: 0;
    width: 100%;
    background: var(--bg-transparent);
    padding: 20px 0;
    transition: background 0.3s ease, padding 0.3s ease, box-shadow 0.3s ease;
    z-index: 1000;
    box-shadow: none;
    display: flex;
    justify-content: center;
    
  }

  header.scrolled {
    background: var(--bg-scrolled);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(10px);
  }

  .container {
    width: 100%;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .logo-container {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  /* Desktop nav links */
  .nav-links {
    display: flex;
  }

  .nav-links a {
    position: relative;
    margin: 0 10px;
    font-weight: 600;
    font-size: 1.1rem;
    color: var(--color-primary);
    text-decoration: none;
    padding-bottom: 5px;
    transition: color 0.3s ease;
    overflow: hidden;
  }

  .nav-links a::before,
  .nav-links a::after {
    content: "";
    position: absolute;
    bottom: 0;
    height: 2px;
    width: 0;
    transition: all 0.3s ease;
  }

  .nav-links a::before {
    left: 0;
    background: var(--purple);
    transition-delay: 0.1s;
  }

  .nav-links a::after {
    right: 0;
    background: white;
    transition-delay: 0s;
  }

  .nav-links a:hover::before {
    width: 100%;
    left: 0;
  }

  .nav-links a:hover::after {
    width: 100%;
    right: 0;
    opacity: 0;
    transition-delay: 0.2s;
  }

  /* Hamburger wrapper - hidden on desktop */
  .hamburger-wrapper {
    display: none;
  }

  /* Mobile menu dropdown */
  .menu {
    position: fixed;
    top: 100%;
    left: 0;
    width: 100%;
    background: rgba(14, 14, 14, 0.9);
    
    padding: 1.2em 0;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.6);
    display: flex;
    flex-direction: column;
    backdrop-filter: blur(10px);
    align-items: center;
    justify-content: center;
    gap: 20px;
    
    
  }

  

  .menu a {
    position: relative;
    color: white;
    font-weight: 700;
    font-size: 1.3rem;
    text-decoration: none;
    transition: color 0.3s ease, transform 0.2s ease;
    padding-bottom: 5px;
    overflow: hidden;
   margin: 0;
  }

  /* Stejný hover efekt pro mobilní menu */
  .menu a::before,
  .menu a::after {
    content: "";
    position: absolute;
    bottom: 0;
    height: 2px;
    width: 0;
    transition: all 0.3s ease;
  }

  .menu a::before {
    left: 0;
    transition-delay: 0.1s;
  }

  .menu a::after {
    right: 0;
    background: white;
    transition-delay: 0s;
  }

  .menu a:hover {
    color: var(--purple);
    transform: scale(1.05);
  }

  .menu a:hover::before {
    width: 100%;
    left: 0;
  }

  .menu a:hover::after {
    width: 100%;
    right: 0;
    opacity: 0;
    transition-delay: 0.2s;
  }

  /* Aktivní linka v mobilu */
  .menu a.selected {
    font-weight: 700;
    border-bottom: 2px solid var(--purple);
  }

  /* Responsive */
  @media (max-width: 768px) {
    .nav-links {
      display: none;
    }
    .hamburger-wrapper {
      display: block;
    }
  }
</style>
