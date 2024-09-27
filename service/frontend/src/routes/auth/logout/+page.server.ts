import { redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
    redirect(303, "/");
};

export const actions: Actions = {
  default: async ({ locals }) => {
    locals.pb.authStore.clear();
    locals.user = null;
    redirect(303, "/");
  },
};
