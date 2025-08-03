<script>
  import { onMount } from 'svelte';

  let visible = false;
  let showSettings = false;
  let analyticsEnabled = false;
  const cookieName = 'cookie_consent';

  function getCookie(name) {
    const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
    return match ? decodeURIComponent(match[2]) : null;
  }

  function setCookie(name, value, days = 180) {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/`;
  }

  function loadAnalytics() {
    if (window.gtagLoaded) return;

    const script = document.createElement('script');
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-9DXMQQGC9J';
    script.async = true;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;
    window.gtagLoaded = true;

    gtag('js', new Date());
    gtag('config', 'G-9DXMQQGC9J');
  }

  onMount(() => {
    const consent = getCookie(cookieName);
    if (!consent) {
      visible = true;
    } else if (consent === 'accepted') {
      loadAnalytics();
    }
  });

  function acceptAll() {
    setCookie(cookieName, 'accepted');
    visible = false;
    loadAnalytics();
  }

  function rejectAll() {
    setCookie(cookieName, 'rejected');
    visible = false;
  }

  function saveSettings() {
    if (analyticsEnabled) {
      setCookie(cookieName, 'accepted');
      loadAnalytics();
    } else {
      setCookie(cookieName, 'rejected');
    }
    visible = false;
  }
</script>

{#if visible}
  <div class="cookie-consent">
    <p class="cookie-message">
      This website uses cookies to improve functionality and track traffic.
    </p>

    {#if showSettings}
      <div class="settings-panel">
        <label><input type="checkbox" disabled checked /> Necessary cookies</label>
        <label><input type="checkbox" bind:checked={analyticsEnabled} /> Analytical cookies</label>
      </div>
      <div class="button-group">
        <button on:click={saveSettings}>Save</button>
        <button class="settings-toggle" on:click={() => showSettings = false}>Back</button>
      </div>
    {:else}
      <div class="button-group">
        <button on:click={acceptAll}>I agree</button>
        <button on:click={rejectAll}>Rfuse</button>
        <button class="settings-toggle" on:click={() => showSettings = true}>Setting</button>
      </div>
    {/if}
  </div>
{/if}

<style>
    .cookie-consent {
  position: fixed;
  bottom: 20px;
  right: 20px;
  max-width: 360px;
  background: #121217;
  color: #e0e0e0;
  border: 1px solid #4b4b6a;
  padding: 16px 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.7);
  font-family: 'Segoe UI', sans-serif;
  font-size: 14px;
  z-index: 9999;
}

.cookie-consent .button-group {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
}

.cookie-consent button {
  background-color: #7c3aed;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.cookie-consent button:hover {
  background-color: #5b21b6;
}

.cookie-consent .settings-toggle {
  background: none;
  color: #9ca3af;
  text-decoration: underline;
  font-size: 13px;
  padding: 0;
  cursor: pointer;
}

.cookie-consent .settings-toggle:hover {
  color: #d8b4fe;
}

.cookie-consent .settings-panel {
  margin: 12px 0;
}

.cookie-consent label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 8px 0;
  font-size: 14px;
}

</style>