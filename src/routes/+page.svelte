<script lang="ts">
    let login = $state(false);
</script>

<div class="absolute top-0 left-0 w-full h-full flex">
    <form action="?/{login? 'login' : 'register'}" method="post" class="flex flex-col items-center justify-center p-16 gap-4">        
        <input 
            id="username"
            name="username"
            type="text"
            placeholder="Username"
            required
        >

        <input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            required
        >

        <button class="w-full px-4 py-3 text-white bg-blue-700 rounded-md text-lg cursor-pointer">
            {login? 'Log in' : 'Register'}
        </button>

        <button type="button" class="text-gray-600 py-2 cursor-pointer" onclick={() => {
            login = !login;
        }}>
            {login? 'Create an account' : 'Log in instead'}
        </button>
    </form>

    <div>

    </div>
</div>

<style lang="postcss">
    @reference "tailwindcss";

    input {
        @apply min-w-0 w-sm rounded-md bg-gray-800 border-2 border-gray-700 caret-white transition-all px-4 py-3 text-gray-100 outline-none;    
    }
</style>