import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { pbGet } from "$lib/queries/get";
import type Client from "pocketbase";

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) {
    redirect(303, "/auth/login");
  }

  const apps = await loadApps(locals.pb);

  return {
    apps,
    user: locals.user,
  };
};

const loadApps = async (pb: Client) => {
  const { data, error } = await pbGet.getAllApps(pb);
  if (error || !data) return [];
  return data;
};
