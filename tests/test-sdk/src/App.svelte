<script>
  import ThrowErrBtn from "./lib/ThrowErrBtn.svelte";
  import freskSDK from "./lib/fresk-instance";

  freskSDK.identify("test@testing-sdk.com");
</script>

<main>
  <h1>Testing Fresk Web SDK</h1>
  <div class="card">
    <ThrowErrBtn />
  </div>
</main>
