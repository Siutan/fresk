import { writable } from "svelte/store";

export const deleteLogs = writable<string[]>([]);
