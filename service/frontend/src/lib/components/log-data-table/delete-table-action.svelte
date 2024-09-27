<script lang="ts">
  import { deleteLogs } from "$lib/stores/test-store";
    import Button from "../ui/button/button.svelte";
    export let id: string;

    const handleDelete = () => {
        deleteLogs.set([id]);
    };
</script>

<Button variant="destructive" on:click={handleDelete}>Delete</Button>