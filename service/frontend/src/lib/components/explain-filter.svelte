<script lang="ts">
  import { Button } from "$lib/components/ui/button";

  const operators = [
    { symbol: "=", description: "Equal" },
    { symbol: "!=", description: "NOT equal" },
    { symbol: ">", description: "Greater than" },
    { symbol: ">=", description: "Greater than or equal" },
    { symbol: "<", description: "Less than" },
    { symbol: "<=", description: "Less than or equal" },
    { symbol: "~", description: "Like/Contains" },
    { symbol: "!~", description: "NOT Like/Contains" },
    { symbol: "?=", description: "Any/At least one of Equal" },
    { symbol: "?!=", description: "Any/At least one of NOT equal" },
    { symbol: "?>", description: "Any/At least one of Greater than" },
    { symbol: "?>=", description: "Any/At least one of Greater than or equal" },
    { symbol: "?<", description: "Any/At least one of Less than" },
    { symbol: "?<=", description: "Any/At least one of Less than or equal" },
    { symbol: "?~", description: "Any/At least one of Like/Contains" },
    { symbol: "?!~", description: "Any/At least one of NOT Like/Contains" },
  ];
</script>

<div class="max-w-2xl mx-auto p-4 shadow-lg rounded-lg">
  <h2 class="text-2xl font-bold mb-4">Filter Syntax Guide</h2>

  <p class="mb-4">
    Filter the returned records. Ex.:
    <code class="bg-gray-700 p-1 rounded"
      >(id='abc' && created>'2022-01-01')?sort="-created"</code
    >
  </p>

  <div class="mt-4">
    <p class="mb-2">
      The syntax basically follows the format <code
        class="bg-gray-700 p-1 rounded">OPERAND OPERATOR OPERAND</code
      >, where:
    </p>

    <ul class="list-disc pl-6 mb-4">
      <li>
        <strong>OPERAND</strong> - could be any of the above field literal, string
        (single or double quoted), number, null, true, false
      </li>
      <li><strong>OPERATOR</strong> - is one of:</li>
    </ul>

    <div class="grid grid-cols-2 gap-2 mb-4">
      {#each operators as op}
        <div class="flex items-center">
          <code class="bg-gray-700 p-1 rounded mr-2">{op.symbol}</code>
          <span>{op.description}</span>
        </div>
      {/each}
    </div>

    <p class="mb-2">Notes:</p>
    <ul class="list-disc pl-6 mb-4">
      <li>
        If not specified, <code class="bg-gray-700 p-1 rounded">~</code> and
        <code class="bg-gray-700 p-1 rounded">!~</code> auto wrap the right string
        OPERAND in a "%" for wildcard match
      </li>
      <li>
        To group and combine several expressions you could use brackets <code
          class="bg-gray-700 p-1 rounded">(...)</code
        >, <code class="bg-gray-700 p-1 rounded">&&</code> (AND) and
        <code class="bg-gray-700 p-1 rounded">||</code> (OR) tokens.
      </li>
    </ul>
  </div>
</div>
