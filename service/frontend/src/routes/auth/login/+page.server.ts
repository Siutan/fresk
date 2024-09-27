import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import type { Actions } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.user) {
    redirect(303, "/");
  }
};

export const actions: Actions = {
  default: async ({ locals, request }) => {
    const data = Object.fromEntries(await request.formData()) as {
      email: string;
      password: string;
    };

    if (!data.email || !data.password) {
      return {
        errors: {
          title: "Email and password is required",
          description: "Please enter both your email and password",
        },
      };
    }

    if (!data.email.includes("@")) {
      return {
        errors: {
          title: "Invalid email",
          description: "Please enter a valid email",
        },
        email: data.email,
      };
    }

    try {
      await locals.pb
        .collection("users")
        .authWithPassword(data.email, data.password);
    } catch (e) {
      return {
        errors: {
          title: "Invalid email or password",
          description: "Please check your email and password",
        },
        email: data.email,
      };
    }

    redirect(303, "/");
  },
};
