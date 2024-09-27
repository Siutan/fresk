import type { Log } from "$lib/types/Log";
import { writable } from "svelte/store";

interface LogStore {
  selected: Log["id"];
}

function createLogStore() {
  const store = writable<LogStore>({ selected: "" });

  return {
    subscribe: store.subscribe,
    setLog: (id: Log["id"]) => {
      store.update((store) => ({ ...store, selected: id }));
    },
  };
}

export const logStore = createLogStore();
