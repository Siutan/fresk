import { pbGet } from "$lib/queries/get";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import type Client from "pocketbase";

export const load: PageServerLoad = async ({ params, locals }) => {
  const appId = params.appId;
  
  if (!appId) return error(404, { message: "Error loading app" });

  const integrations = await fetchIntegrations(locals.pb, appId);

  return {
    integrations: integrations,
  };
};

const fetchIntegrations = async (pb: Client, appId: string) => {
  const { data: integrations, error: integrationError } =
    await pbGet.getIntegrationsByApp(pb, appId);
  if (integrationError || !integrations)
    error(404, { message: "Error loading integrations" });
  return integrations;
};
