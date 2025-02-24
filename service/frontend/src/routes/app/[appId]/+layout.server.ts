import { pbGet } from "$lib/queries/get";
import { error } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import type Client from "pocketbase";

export const load: LayoutServerLoad = async ({ params, locals, depends }) => {
  depends('app:app-server-load');
  const appId = params.appId;
  if (!appId) return error(404, { message: "Error loading app" });
  const appDetails = await loadAppDetails(locals.pb, appId);
  const apps = await loadApps(locals.pb);
  return {
    app: appDetails,
    apps,
  };
};

const loadAppDetails = async (pb: Client, appId: string) => {
  const { data, error: appError } = await pbGet.getAppById(pb, appId);
  if (appError || !data) error(404, { message: "Error loading app" });
  return data;
};

const loadApps = async (pb: Client) => {
  const { data, error } = await pbGet.getAllApps(pb);
  if (error || !data) return [];
  return data;
};