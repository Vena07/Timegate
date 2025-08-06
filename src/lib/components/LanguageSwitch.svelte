<script>
  import { page } from '$app/stores';
  $: currentPath = $page.url.pathname;

  $: isEnglish = currentPath.startsWith('/en');
  $: switchTo = isEnglish ? currentPath.replace('/en', '') || '/' : `/en`;
</script>

<a href={switchTo} class="lang-switch">
  {isEnglish ? 'Česky' : 'English'}
</a>

<style>
  .lang-switch {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    background: rgba(0, 0, 0, 0.6);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    text-decoration: none;
    font-size: 1rem;
    cursor: pointer;
    z-index: 1000; /* aby byl nad ostatními prvky */
    transition: opacity 0.2s ease;
  }

  .lang-switch:hover {
    opacity: 0.8;
  }
</style>
