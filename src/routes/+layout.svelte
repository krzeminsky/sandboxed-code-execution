<script lang="ts">
	import '../app.css';
	
	let { children } = $props();
</script>

{@render children()}

<style lang="postcss">
    @reference 'tailwindcss';

    :global(body) {
        @apply bg-gray-900 font-mono;
    }
</style>
