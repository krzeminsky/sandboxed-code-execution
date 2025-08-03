<script lang="ts">
    const { data } = $props();

    const problem = data.problem;

    const tabs = ["Solution", "data.txt"];
    let selectedTab = $state(tabs[0]);

    let verdict = $state<string|null>(null);
    let awaitingVerdict = $state(false);

    let serverSolution = $state(problem.solution.solution);
    let clientSolution = $state(problem.solution.solution);

    let awaitingSave = $state(false);
    let unsavedChanges = $derived(serverSolution !== clientSolution);

    function correctTextArea(e: KeyboardEvent) {
        const source = e.target as HTMLTextAreaElement;

        if (e.key === "Tab") {
            e.preventDefault();

            const start = source.selectionStart;
            const end = source.selectionEnd;

            source.value = source.value.substring(0, start) + "\t" + source.value.substring(end);

            source.selectionStart = source.selectionEnd = start + 1;
        } else if (e.key === "Enter") {
            e.preventDefault();

            const start = source.selectionStart;
            const end = source.selectionEnd;

            let tabCount = 0;

            for (let i = start; i >= 0; i--) {
                const val = source.value[i];

                if (val === "\n") break;
                else if (val === "\t") tabCount++;
            }

            const insert = "\t".repeat(tabCount);

            source.value = source.value.substring(0, start) + "\n" + insert + source.value.substring(end);
            source.selectionStart = source.selectionEnd = start + 1 + tabCount;
        }
    }

    async function getVerdict() {
        verdict = null;
        awaitingVerdict = true;

        const res = await fetch("/api/judge", {
            method: "POST",
            body: JSON.stringify({
                problemId: problem.id,
                solution: clientSolution
            })
        });

        verdict = await res.text();

        awaitingVerdict = false;
    }

    async function saveSolution() {
        if (!unsavedChanges) {
            return;
        }

        awaitingSave = true;

        const res = await fetch("/api/solutions/save", {
            method: "POST",
            body: JSON.stringify({
                id: problem.solution.id,
                solution: clientSolution
            })
        });

        if (res.ok) {
            serverSolution = clientSolution;
        }

        awaitingSave = false;
    }
</script>

<div class="absolute top-0 left-0 w-full h-full flex gap-4 p-12">
    <div class="text-white w-xl flex flex-col gap-4">
        <div class="flex-1">
            <h1 class="text-4xl py-4">{problem.id}. {problem.name}
                <a href="/problem-list" class="inline-block font-normal text-xl text-gray-500 underline-offset-4 underline">Go back</a>
            </h1>

            <p>{problem.description}</p>
        </div>

        <div class="w-full flex flex-col gap-4">
            {#if verdict}
            <div class="h-40 bg-gray-950 shadow-xl border-2 border-gray-700 rounded-xl text-white overflow-hidden">
                {JSON.stringify(JSON.parse(verdict), null, 2)}
            </div>
            {/if}

            <button class="bg-blue-700 py-4 px-4 rounded-md shadow-xl mb-1.5 cursor-pointer disabled:opacity-50 transition-opacity" disabled={awaitingVerdict} onclick={getVerdict}>
                {#if awaitingVerdict}
                Judging...
                {:else}
                <img src="/play.svg" alt="Run code" class="h-6 mx-auto" />
                {/if}
            </button>
        </div>
    </div>

    <div class="flex-1 flex flex-col">
        <div class="tabs flex">
            {#each tabs as t}
            <button class="{selectedTab == t? "selected-tab" : ""}" onclick={() => selectedTab = t}>
                {t}
            </button>
            {/each}
        </div>

        <div class="relative bg-gray-950 flex-1 flex rounded-xl rounded-tl-none shadow-xl border-2 border-gray-700 text-white overflow-y-auto">
            {#if selectedTab === "Solution"}
            <textarea 
                class="relative flex-1 resize-none bg-transparent border-none rounded-xl rounded-tl-none transition-all outline-transparent p-4 z-10" 
                bind:value={clientSolution}
                spellcheck="false"
                onkeydown={correctTextArea}
                placeholder="Write your code here..."
            ></textarea>

            {#if unsavedChanges}
            <div class="
                absolute bottom-0 left-1/2 -translate-x-1/2 bg-blue-700 px-4 py-2 text-sm rounded-t-xl min-w-sm text-center z-20
                {awaitingSave? 'opacity-50' : ''} transition-opacity
            ">
                {#if !awaitingSave}
                <button class="cursor-pointer" onclick={saveSolution}>
                    You have unsaved changes. <span class="underline underline-offset-4">Click to save</span>
                </button>
                {:else}
                Saving...
                {/if}
            </div>
            {/if}

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