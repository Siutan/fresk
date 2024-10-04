<script lang="ts">
  import UsersTable from "$lib/components/users-table/users-table.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<div class="w-full flex flex-col gap-4">
  <div class="w-full flex flex-col gap-4">
    <h1 class="text-2xl font-bold">Users</h1>
    <div>
      <UsersTable data={data.users} />
    </div>
  </div>
</div>
