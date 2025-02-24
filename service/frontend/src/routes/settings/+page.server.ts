import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, cookies }) => {
  if (!locals.user) {
    redirect(303, "/auth/login");
  }

  const layoutCookie = cookies.get("PaneForge:layout");
  const collapsedCookie = cookies.get("PaneForge:collapsed");

  let layout: number[] | undefined;
  let collapsed: boolean | undefined;

  if (layoutCookie) layout = JSON.parse(layoutCookie);

  if (collapsedCookie) collapsed = JSON.parse(collapsedCookie);

  return { layout, collapsed };
};

export const actions: Actions = {
  logout: async ({ locals }) => {
    const { pb } = locals;
	pb.authStore.clear();
	return redirect(303, "/auth/login");
  },
};
