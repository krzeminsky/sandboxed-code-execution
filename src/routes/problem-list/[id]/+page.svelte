<script lang="ts">
    const { data } = $props();

    const problem = data.problem;

    const tabs = ["Solution", "data.txt"];
    let selectedTab = $state(tabs[0]);

    function correctTextArea(e: KeyboardEvent) {
        const source = e.target as HTMLTextAreaElement;

        if (e.key === "Tab") {
            e.preventDefault();

            const start = source.selectionStart;
            const end = source.selectionEnd;

            source.value = source.value.substring(0, start) + "\t" + source.value.substring(end);

            source.selectionStart = source.selectionEnd = start + 1;
        } else if (e.key === "Enter") {
            
        }
    }
</script>

<div class="absolute top-0 left-0 w-full h-full flex p-8">
    <div class="text-white w-xl">
        <h1 class="text-4xl py-4">{problem.id}. {problem.name}</h1>
        <p>{problem.description}</p>
    </div>

    <div class="flex-1 flex flex-col">
        <div class="tabs flex">
            {#each tabs as t}
            <button class="{selectedTab == t? "selected-tab" : ""}" onclick={() => selectedTab = t}>
                {t}
            </button>
            {/each}
        </div>

        <div class="bg-gray-950 flex-1 rounded-xl rounded-tl-none shadow-xl border-2 border-gray-700 text-white">
            {#if selectedTab === "Solution"}
            <textarea 
                class="w-full h-full resize-none bg-transparent border-none rounded-xl rounded-tl-none transition-all outline-transparent p-4" 
                bind:value={problem.solution.solution}
                onkeydown={correctTextArea}
                placeholder="Write your code here..."
            ></textarea>
            {:else if selectedTab === "data.txt"}
            <pre class="p-4">{problem.data}</pre>
            {/if}
        </div>
    </div>
</div>

<style lang="postcss">
    @reference "tailwindcss";

    .tabs {
        @apply bg-gray-800 w-min rounded-t-xl;
    }

    .tabs button {
        @apply px-4 py-1 text-gray-600 cursor-pointer rounded-t-xl transition-all;

        &:hover {
            @apply bg-gray-700 text-gray-400;
        }
    }

    .selected-tab {
        @apply bg-gray-700 text-gray-400!;
    }
</style>