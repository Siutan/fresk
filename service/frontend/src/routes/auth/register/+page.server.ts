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
      passwordConfirm: string;
    };

    if (!data.email || !data.password || !data.passwordConfirm) {
      return {
        errors: {
          title: "Email, password and confirm password is required",
          description: "Please enter all the required fields",
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

    if (data.password !== data.passwordConfirm) {
      return {
        errors: {
          title: "Passwords do not match",
          description: "Please enter the same password for both fields",
        },
        email: data.email,
      };
    }

    try {
      await locals.pb.collection("users").create({...data, access_level: "member"});
      await locals.pb
        .collection("users")
        .authWithPassword(data.email, data.password);
    } catch (e) {
      return {
        errors: {
          title: "An error occurred",
          description: "Please try again later",
        },
        email: data.email,
      };
    }

    redirect(303, "/");
  },
};
