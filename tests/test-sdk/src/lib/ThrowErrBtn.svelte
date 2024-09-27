<script>
  const throwNewError = () => {
    throw new Error("Error clicking button");
  };

  const throwAdvancedError = () => {
    throw new Error("Advanced error", {
      cause: new Error("Cause"),
      stacktrace: "Stacktrace",
    });
  };
</script>

<button on:click={throwNewError}> Throw Error </button>
<button on:click={throwAdvancedError}> Throw Advanced Error </button>
