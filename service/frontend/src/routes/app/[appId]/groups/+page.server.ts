import { pbGet } from "$lib/queries/get";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import type Client from "pocketbase";

export const load: PageServerLoad = async ({ params, locals }) => {
  const appId = params.appId;
  if (!appId) return error(404, { message: "Error loading app" });
};
