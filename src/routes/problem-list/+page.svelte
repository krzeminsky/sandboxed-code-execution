<script lang="ts">
	const { data } = $props();
</script>

<div class="absolute top-0 left-0 w-full h-full flex flex-col">
    <h1 class="p-4 mt-4 text-blue-600 font-bold text-4xl">
        Problem list
        <a href="/logout" class="inline-block font-normal text-xl text-gray-500 underline-offset-4 underline">
            Logout
        </a>
    </h1>
    
    <div class="flex-1 flex flex-col text-gray-50 w-full p-4">
        {#each data.result as p}
        <a href="/problem-list/{p.id}" class="w-full bg-gray-800 p-4 border-2 border-gray-700 rounded-md">
            <span>{p.id}.</span>
            <span>{p.name}</span>
        </a>
        {/each}
    </div>
</div>

