<script lang="ts">
	import hljs from 'highlight.js';
	import 'highlight.js/styles/atom-one-dark.css';

	let code = $state('');
	let highlighted = $derived(hljs.highlight(code, { language: 'python', ignoreIllegals: false }));

	let syntaxTrailingNewLinesCorrection = $state('');

	// ! Horrible workarounds
	// ! HighlightJs removes trailing newLines
	// ! Fix the html/css or implement custom highligher idk

	$effect(() => {
		let count = 0;

		for (let i = code.length - 1; i > 0; i--) {
			if (code[i] === '\n') {
				count++;
			} else {
				break;
			}
		}

		syntaxTrailingNewLinesCorrection = '\n'.repeat(count);
	});

	let codeArea: HTMLDivElement;

	function handleOnKeyDown(e: KeyboardEvent) {
		if (e.key === 'Tab') {
			preventTab(e);
		} else if (e.key === 'Enter') {
			correctIndentation(e);
		}
	}

	function preventTab(e: KeyboardEvent) {
		e.preventDefault();
		e.stopPropagation();

		const source = e.target as HTMLTextAreaElement;
		const start = source.selectionStart;

		let val = source.value;

		val = val.substring(0, start) + '\t' + val.substring(source.selectionEnd);

		source.value = val;
		code = val;

		source.selectionStart = source.selectionEnd = start + 1;
	}

	function correctIndentation(e: KeyboardEvent) {
		e.preventDefault();
		e.stopPropagation();

		const source = e.target as HTMLTextAreaElement;
		const start = source.selectionStart;

		let val = source.value;
		let tabCount = 0;

		for (let i = start; i > 0; i--) {
			if (val[i] === '\n') {
				break;
			}

			if (val[i] === '\t') {
				tabCount++;
			}
		}

		if (val[start - 1] === ':') {
			tabCount++;
		}

		const tabs = '\t'.repeat(tabCount);

		val = val.substring(0, start) + '\n' + tabs + val.substring(source.selectionEnd);

		source.value = val;
		code = val;

		source.selectionStart = source.selectionEnd = start + 1 + tabCount;
	}

	function applyScroll(e: Event) {
		const target = e.target as HTMLElement;

		codeArea.scrollTop = target.scrollTop;
	}
</script>

<div class="absolute top-0 left-0 flex h-full w-full gap-8 p-16">
	<div class="relative container grow font-mono">
		<textarea
			class="code-area z-10 resize-none bg-transparent text-transparent caret-white"
			spellcheck="false"
			placeholder="Write your code here..."
			bind:value={code}
			onscroll={applyScroll}
			onkeydown={handleOnKeyDown}
		></textarea>

		<div class="code-area whitespace-pre-wrap text-white select-none" bind:this={codeArea}>
			{@html highlighted.value}

			<span>{syntaxTrailingNewLinesCorrection}</span>
		</div>

		<div
			class="absolute top-0 right-0 rounded-tr-xl rounded-bl-xl border-b-2 border-l-2 border-gray-500 bg-slate-700 px-4 py-2 text-xs font-bold text-slate-400 select-none"
		>
			Python
		</div>
	</div>

	<div class="container flex w-md flex-col overflow-hidden">
		<div class="w-full grow"></div>

		<button
			class="m-4 flex cursor-pointer items-center justify-center rounded-lg bg-green-500 p-4 text-2xl text-white transition-all active:scale-95"
		>
			<img src="play-icon.svg" alt="start" class="h-8" />
		</button>
	</div>
</div>

<style lang="postcss">
	@reference "tailwindcss";

	.code-area::-webkit-scrollbar {
		display: none;
	}

	.container {
		@apply h-full rounded-xl border-2 border-gray-500 bg-gray-800 shadow-2xl;
	}

	.code-area {
		@apply absolute top-0 left-0 h-full w-full overflow-y-scroll rounded-xl p-5 text-2xl;
	}

	:global(body) {
		@apply bg-slate-800;
	}
</style>
