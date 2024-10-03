<script lang="ts">
  export let size = 20;
</script>

<svg class="loader" viewBox="0 0 100 100" style="width: {size}px; height: {size}px;">
  <circle
    class="loader__ring loader__ring--a stroke-primary"
    cx="50"
    cy="50"
    r="46"
    fill="none"
    stroke-width="8"
  />
  <circle
    class="loader__ring loader__ring--b stroke-primary-foreground"
    cx="50"
    cy="50"
    r="36"
    fill="none"
    stroke-width="8"
  />
  <circle
    class="loader__ring loader__ring--c stroke-secondary-foreground"
    cx="50"
    cy="50"
    r="26"
    fill="none"
    stroke-width="8"
  />
  <circle
    class="loader__ring loader__ring--d stroke-sky-500"
    cx="50"
    cy="50"
    r="16"
    fill="none"
    stroke-width="8"
  />
</svg>

<style>
  .loader__ring {
    stroke-dasharray: 580;
    stroke-dashoffset: 580;
    transform-origin: center;
    animation:
      rotate 4s linear infinite,
      dash 4s ease-in infinite;
    stroke-linecap: round;
  }
  .loader__ring--a {
    animation-delay: 0s;
  }
  .loader__ring--b {
    animation-delay: -1s;
  }
  .loader__ring--c {
    animation-delay: -2s;
  }
  .loader__ring--d {
    animation-delay: -3s;
  }

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }
  @keyframes dash {
    0% {
      stroke-dashoffset: 580;
    }
    50% {
      stroke-dashoffset: 0;
    }
    100% {
      stroke-dashoffset: -580;
    }
  }
</style>
