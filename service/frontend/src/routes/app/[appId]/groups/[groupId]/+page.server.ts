import { pbGet } from "$lib/queries/get";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import type Client from "pocketbase";

export const load: PageServerLoad = async ({ params, locals }) => {
  const appId = params.appId;
  if (!appId) return error(404, { message: "Error loading app" });
  const groupId = params.groupId;
  if (!groupId) return error(404, { message: "Error loading group" });

  const group = await getGroupDetails(locals.pb, groupId);

  const sessions = await getErrors(locals.pb, groupId);

  // group the sessions where the page id is the same
  const pageBreakdown = sessions?.reduce(
    (acc: { pageId: string; count: number }[], session) => {
      const sessionId = session.page_id;
      const existingPage = acc.find((item) => item.pageId === sessionId);
      if (existingPage) {
        existingPage.count += 1;
      } else {
        acc.push({ pageId: sessionId, count: 1 });
      }
      return acc;
    },
    []
  );

  // group the sessions by browser
  const browserBreakdown = sessions?.reduce(
    (acc: { browserName: string; count: number }[], session) => {
      const browser = session.browser_name;
      const existingBrowser = acc.find((item) => item.browserName === browser);
      if (existingBrowser) {
        existingBrowser.count += 1;
      } else {
        acc.push({ browserName: browser, count: 1 });
      }
      return acc;
    },
    []
  );

  // group the sessions by time of day
  const timeOfDayBreakdown = Array.from({ length: 24 }, (_, hour) => {
    const hourLabel =
      hour === 0 ? "12 AM" : hour < 12 ? `${hour} AM` : `${hour - 12} PM`;
    return {
      hour: hourLabel,
      errors:
        sessions?.filter((session) => {
          const sessionHour = new Date(session.created).getHours();
          return sessionHour === hour;
        }) || [],
    };
  });

  // group sessions by os
  const osBreakdown = sessions?.reduce(
    (acc: { os: string; count: number }[], session) => {
      const os = session.os_name;
      const existingOs = acc.find((item) => item.os === os);
      if (existingOs) {
        existingOs.count += 1;
      } else {
        acc.push({ os, count: 1 });
      }
      return acc;
    },
    []
  );

  return {
    group,
    pageBreakdown,
    browserBreakdown,
    timeOfDayBreakdown,
    osBreakdown,
    errors: sessions,
  };
};

const getGroupDetails = async (pocketbase: Client, groupId: string) => {
  const { data: group, error } = await pbGet.getLogGroupById(
    pocketbase,
    groupId
  );
  if (error || !group) return;
  const members = await getMembers(pocketbase);
  if (!members) return;
  group.members = members;

  return group;
};

const getMembers = async (pocketbase: Client) => {
  const { data: members, error } = await pbGet.getAllMembers(pocketbase);
  if (error || !members) return;
  return members;
};

const getErrors = async (pocketbase: Client, groupId: string) => {
  const { data: sessionIds, error } = await pbGet.getErrorsByErrorGroupId(
    pocketbase,
    groupId
  );
  if (error || !sessionIds) return;
  // reversing because the logs are in descending order of created and we want to show the most recent first
  return sessionIds.reverse();
};
