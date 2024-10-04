import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { pbGet } from "$lib/queries/get";

export const load: PageServerLoad = async ({ locals, depends }) => {
  depends("app:users-server-load");

  if (locals?.user?.access_level < 2) {
    redirect(303, "/");
  }

  if (!locals.user) {
    redirect(303, "/auth/login");
  }

  const { data, error } = await pbGet.getAllMembers(locals.pb);

  if (error || !data) {
    return {
      users: [],
    };
  }

  // Return the data
  return {
    users: data,
  };
};
