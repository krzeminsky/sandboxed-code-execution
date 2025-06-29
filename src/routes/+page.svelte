<script lang="ts">
	let register = $state(false);
	let awaitingResponse = $state(false);
</script>

<div class="absolute top-0 left-0 flex h-full w-full items-center">
	<form
		method="post"
		action="?/{register ? 'register' : 'login'}"
		class="flex grow flex-col items-center justify-center gap-4"
	>
		<h1 class="text-5xl font-extrabold text-slate-800">{register ? 'Register' : 'Log in'}</h1>

		<input
			id="username"
			name="username"
			placeholder="Username"
			type="text"
			required
			class="form-input min-w-sm rounded-md border-2 border-slate-200 shadow-sm outline-transparent transition-all"
		/>

		<input
			id="password"
			name="password"
			placeholder="Password"
			type="password"
			required
			class="form-input min-w-sm rounded-md border-2 border-slate-200 shadow-sm outline-transparent transition-all"
		/>

		<div class="min-w-sm px-1">
			<input
				id="register"
				name="register"
				type="checkbox"
				class="form-checkbox rounded-sm outline-transparent transition-all"
				bind:checked={register}
			/>
			<label for="register">Register</label>
		</div>

		<button
			type="submit"
			class="min-w-sm cursor-pointer rounded-md bg-slate-800 py-4 text-lg text-slate-100"
		>
			Submit
		</button>
	</form>

	<div class="prose max-w-1/2 grow">
		<h1>Sandboxed code execution</h1>

		<h2>Stack:</h2>
		<ul>
			<li>Docker</li>
			<li>Prisma</li>
			<li>Postgresql</li>
			<li>SvelteKit</li>
		</ul>
	</div>
</div>

<style lang="postcss">
	@reference "tailwindcss";
</style>
