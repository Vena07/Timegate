<script>
  import { page } from '$app/stores';
  $: currentPath = $page.url.pathname;

  $: isEnglish = currentPath.startsWith('/en');
  $: switchTo = isEnglish ? currentPath.replace('/en', '') || '/' : `/en${currentPath}`;
</script>

<a href={switchTo} class="lang-switch">
  {isEnglish ? 'Česky' : 'English'}
</a>

<style>
  .lang-switch {
    display: inline-block;
    margin-top: 1rem;
    color: white;
    text-decoration: underline;
    cursor: pointer;
    font-size: 1rem;
  }

  .lang-switch:hover {
    opacity: 0.8;
  }
</style>

