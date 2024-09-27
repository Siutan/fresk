import { writable } from "svelte/store";

interface IntegrationStore {
  selected: string;
}

function createIntegrationStore() {
  const store = writable<{ selected: string | null }>({ selected: null });

  return {
    subscribe: store.subscribe,
    setIntegration: (id: string) => {
      store.update((store) => ({ ...store, selected: id }));
    },
  };
}

export const integrationStore = createIntegrationStore();