import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, cookies }) => {
  if (!locals.user) {
    redirect(303, "/auth/login");
  }

  
};
