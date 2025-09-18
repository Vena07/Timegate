<script>
  import { Phone, Mail } from 'lucide-svelte';
   let name = '';
  let email = '';
  let message = '';
  let success = false;
  let error = '';

  async function handleSubmit() {
    try {
      const res = await fetch('/kontakt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      });

      const data = await res.json();

      if (res.ok) {
        success = true;
        name = '';
        email = '';
        message = '';
      } else {
        error = data.error || 'Něco se pokazilo.';
      }
    } catch (err) {
      error = 'Chyba spojení se serverem.';
    }
  }
</script>

<section class="contact-section">
  <div class="contact-wrapper">
    <h1>Kontakt</h1>
    <p>Máte dotaz? Kontaktujte nás telefonicky nebo emailem.</p>
{#if success}
  <p style="color: green;">Zpráva byla odeslána!</p>
{:else if error}
  <p style="color: red;">{error}</p>
{/if}

<form class="contact-form" on:submit|preventDefault={handleSubmit}>
  <input type="text" placeholder="Vaše jméno" bind:value={name} required />
  <input type="email" placeholder="Váš email" bind:value={email} required />
  <textarea rows="5" placeholder="Vaše zpráva" bind:value={message} required></textarea>
  <button type="submit">Odeslat zprávu</button>
</form>


    <div class="contact-info">
      <div class="contact-item">
        <Phone class="icon" />
        <strong>Telefon:</strong> <a href="tel:+420123456789">+420 776 519 911
</a>
      </div>
    <div class="contact-item">
        <Mail class="icon" />
        <strong>Email:</strong> <a href="mailto:info@timegate.cz">ttimegate@gmail.com</a>
      </div>
    </div>
  </div>
</section>
<style>
  .contact-section {
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-direction: column;
    min-height: 100vh;
    padding: 2rem;
    color: white;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }

  .contact-wrapper {
    max-width: 600px;
    width: 100%;
    text-align: center;
  }

  h1 {
    margin-bottom: 1rem;
  }

  p {
    margin-bottom: 2rem;
  }

  .contact-info {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-top: 20px;
    gap: 1rem;
    margin-bottom: 3rem;
    color: white;
  }

  .contact-item {
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  a {
    color: #ffffff;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  .contact-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    text-align: left;
  }

  .contact-form input,
  .contact-form textarea {
    width: 95%;
    padding: 0.8rem 1rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    background: #1a1a1a;
    color: white;
  }

  .contact-form input::placeholder,
  .contact-form textarea::placeholder {
    color: #999;
  }

  .contact-form button {
    background-color: #fff;
  border-radius: 10px;
  color: #0d172a;
  font-size: 1rem;
  font-weight: 600;
  padding: 0.8rem 1.4rem;
  text-decoration: none;
  transition: background 0.2s ease;
  }

  .contact-form button:hover {
    background-color: #1e293b;
  color: #fff;
  }

    @media (max-width: 767px) {
    .contact-info{
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
}
</style>
