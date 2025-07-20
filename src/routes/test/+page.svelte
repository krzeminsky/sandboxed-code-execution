<script lang="ts">
    $effect(() => {
        fetch('/api/judge', {
            method: "POST",
            body: JSON.stringify({
                problemId: 1,
                solution: 
`
def solution():
    return 25                
`
            })
        })
    })
</script>