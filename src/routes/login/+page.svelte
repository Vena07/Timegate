<script>
	import { goto } from '$app/navigation';

	let loginSuccess = false;
	let notification = '';
	let nickname = '';
	let password = '';
	let rememberMe = false; // Stav pro "Zapamatovat si mě"

	async function login(event) {
		event.preventDefault();
		notification = '';

		const formData = new FormData();
		formData.append('nickname', nickname);
		formData.append('password', password);
		formData.append('rememberMe', rememberMe ? 'true' : 'false'); // Přidáme hodnotu pro "Zapamatovat si mě"

		try {
			const response = await fetch('/login', {
				method: 'POST',
				body: formData,
			});

			if (response.ok) {
				const result = await response.json();
				if (result.success) {
					loginSuccess = true;
					setTimeout(() => {
						goto('/admin');
					}, 1000);
				} else if (result.message === 'Please verify your email before logging in.') {
					notification = 'The email has not been verified yet. Please verify it before logging in.';
				} else {
					notification = result.message;
				}
			} else {
				const errorResult = await response.json();
				notification = errorResult.message;
			}
		} catch (error) {
			notification = 'An unexpected error occurred. Please try again later.';
			console.error(error);
		}
	}
</script>

<form on:submit={login} >
	<h1>LOGIN</h1>
	<label>
		Nick
		<input type="text" bind:value={nickname} required />
	</label>
	<label>
		Heslo
		<input type="password" bind:value={password} required />
	</label>
	<div>
		<input type="checkbox" bind:checked={rememberMe} />
		<span>Remember me</span>
	</div>
	<button type="submit"><strong>Přihlásit se</strong></button>
</form>

{#if notification}
	<div class="notification">{notification}</div>
{/if}

<style>
:global(body) {
  background-color: #0e0e0e;
  color: #eee;
  font-family: var(--font-text);
  margin: 0;
  padding: 0;
}

form {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1rem;
}
input[type="text"],
input[type="password"]{
  padding: 0.6rem;
  border: 1px solid #444;
  border-radius: 6px;
  background-color: #111;
  color: #eee;
  font-size: 1rem;
  font-family: var(--font-text);
  transition: border-color 0.2s;
  width: 95%;
}
</style>