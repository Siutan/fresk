<script>
  import ThrowErrBtn from "./lib/ThrowErrBtn.svelte";

  $:console.log(document.referrer)
</script>

<main>
  <h1>Testing Fresk Web SDK</h1>
  <div class="card">
    <ThrowErrBtn />
  </div>
</main>
