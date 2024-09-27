import * as Config from "../../../../configs/config.json";
import { readable } from "svelte/store";

export const config = readable<typeof Config>(Config);
