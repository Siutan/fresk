<script lang="ts">
  const throwNewError = () => {
    throw new Error("Simple error clicking button");
  };

  const throwAdvancedError = () => {
    throw new Error("Advanced error", {
      cause: new Error("Cause"),
      stacktrace: "Stacktrace",
    });
  };

  const throwTypeError = () => {
    const num: number = "not a number" as any;
    num.toFixed(2);
  };

  const throwReferenceError = () => {
    // @ts-ignore
    console.log(undefinedVariable);
  };

  const throwSyntaxError = () => {
    eval("This is not valid JavaScript!");
  };

  const throwRangeError = () => {
    const arr = new Array(-1);
  };

  const throwCustomError = () => {
    class CustomError extends Error {
      constructor(message: string) {
        super(message);
        this.name = "CustomError";
      }
    }
    throw new CustomError("This is a custom error type");
  };

  const throwAsyncError = async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
    throw new Error("Async operation failed");
  };

  const throwNestedError = () => {
    const level3 = () => { throw new Error("Level 3 error"); };
    const level2 = () => { level3(); };
    const level1 = () => { level2(); };
    level1();
  };
</script>

<div class="grid grid-cols-2 gap-4 p-4">
  <button on:click={throwNewError} class="btn btn-error">
    Throw Simple Error
  </button>
  <button on:click={throwAdvancedError} class="btn btn-error">
    Throw Advanced Error
  </button>
  <button on:click={throwTypeError} class="btn btn-warning">
    Throw TypeError
  </button>
  <button on:click={throwReferenceError} class="btn btn-warning">
    Throw ReferenceError
  </button>
  <button on:click={throwSyntaxError} class="btn btn-warning">
    Throw SyntaxError
  </button>
  <button on:click={throwRangeError} class="btn btn-warning">
    Throw RangeError
  </button>
  <button on:click={throwCustomError} class="btn btn-info">
    Throw Custom Error
  </button>
  <button on:click={() => throwAsyncError().catch(console.error)} class="btn btn-info">
    Throw Async Error
  </button>
  <button on:click={throwNestedError} class="btn btn-info">
    Throw Nested Error
  </button>
</div>