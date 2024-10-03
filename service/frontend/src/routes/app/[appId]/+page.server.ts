import { pbGet } from "$lib/queries/get";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import type Client from "pocketbase";

export const load: PageServerLoad = async ({ params, locals, parent }) => {
  const appId = params.appId;
  if (!appId) return error(404, { message: "Error loading app" });

  // get number of logs and arrange them in { 1day: number, 7day: number, 30day: number }
  const endDate = new Date();
  const endDateFormatted = endDate.toISOString().replace('T', ' ')

  // 30 days ago
  const startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
  const startDateFormatted = startDate.toISOString().replace('T', ' ')

  const { data: logs, error: logError } = await pbGet.getLogsInRange(
    locals.pb,
    appId,
    startDateFormatted,
    endDateFormatted
  );

  if (logError || !logs) error(404, { message: "Error loading logs" });

  const logsByDay = logs.items.reduce((acc: Record<string, number>, log) => {
    const date = new Date(log.created);
    const formattedDate = date.toISOString().split('T')[0]; // Format to yyyy-mm-dd
    if (formattedDate in acc) {
      acc[formattedDate]++;
    } else {
      acc[formattedDate] = 1;
    }
    return acc;
  }, {});

  const logsByPage = logs.items.reduce((acc: Record<string, number>, log) => {
    const pageId = log.page_id; // Assuming log has a pageId property
    if (pageId in acc) {
      acc[pageId]++;
    } else {
      acc[pageId] = 1;
    }
    return acc;
  }, {});

  // Convert the object to an array of {pageId: count} and sort by highest count
  const sortedLogsByPageArray = Object.entries(logsByPage)
    .map(([pageId, count]) => ({ pageId, count }))
    .sort((a, b) => b.count - a.count);

  return {
    logsByDay: logsByDay,
    logsByPage: sortedLogsByPageArray,
  };
};
