import { pb } from "$lib/pocketbase";
import type { Member } from "$lib/types/member";

type QueryOption = {
  [key: string]: string;
};

const pbGet = {
  getAllMembers: async (pocketbase = pb) => {
    try {
      const records = (await pocketbase.collection("users").getFullList({
        sort: "-created",
      })) as Member[];

      const mappedRecords = records.map((record) => {
        record.avatar = `https://api.dicebear.com/9.x/avatar/svg?seed=${record.name}`;
        return record;
      });
      return { data: mappedRecords, error: null };
    } catch (error) {
      console.error("error", error);
      return { data: null, error };
    }
  },
  getAllApps: async (pocketbase = pb) => {
    try {
      const records = await pocketbase.collection("apps").getFullList({
        sort: "-created",
      });
      return { data: records, error: null };
    } catch (error) {
      console.error("error", error);
      return { data: null, error };
    }
  },
  getAppById: async (pocketbase = pb, id: string) => {
    try {
      const record = await pocketbase.collection("apps").getOne(id);
      return { data: record, error: null };
    } catch (error) {
      console.error("error", error);
      return { data: null, error };
    }
  },
  getLogGroupsByAppId: async (appId: string, page: number, perPage: number) => {
    try {
      const records = await pb
        .collection("error_group_view")
        .getList(page, perPage, {
          filter: `app="${appId}"`,
          sort: "-last_seen",
          expand: "assignee",
        });
      return { data: records, error: null };
    } catch (error) {
      console.error("error", error);
      return { data: null, error };
    }
  },
  getLogGroupById: async (pocketbase = pb, groupId: string) => {
    try {
      const record = await pocketbase
        .collection("error_group_view")
        .getOne(groupId, {
          expand: "assignee",
        });
      return { data: record, error: null };
    } catch (error) {
      console.error("error", error);
      return { data: null, error };
    }
  },
  getLogGroupsByCustomQuery: async (appId: string, query: string) => {
    try {
      // separate the query into filter and sort
      const [filter, sort] = query.split("?sort=");
      const options: QueryOption = { app: appId };

      if (filter) {
        options.filter = `app="${appId}" && ${filter}`;
      }
      if (sort) {
        options.sort = sort.replace(/"/g, "");
      } else {
        options.sort = "-last_seen";
      }

      options.expand = "assignee";

      const record = await pb
        .collection("error_group_view")
        .getList(1, 500, options);
      return { data: record, error: null };
    } catch (error) {
      console.error("error", error);
      return { data: null, error };
    }
  },
  getErrorsByErrorGroupId: async (pocketbase = pb, groupId: string) => {
    try {
      const records = await pocketbase.collection("errors").getFullList({
        filter: `error_group="${groupId}"`,
        sort: "-created",
      });
      return { data: records, error: null };
    } catch (error) {
      console.error("error", error);
      return { data: null, error };
    }
  },
  getLogsByAppId: async (appId: string, page: number, perPage: number) => {
    try {
      const records = await pb.collection("errors").getList(page, perPage, {
        filter: `app="${appId}"`,
        sort: "-created",
      });
      return { data: records, error: null };
    } catch (error) {
      console.error("error", error);
      return { data: null, error };
    }
  },
  getLogsByCustomQuery: async (appId: string, query: string) => {
    try {
      // separate the query into filter and sort
      const [filter, sort] = query.split("?sort=");
      const options: QueryOption = { app: appId };

      if (filter) {
        options.filter = `app="${appId}" && ${filter}`;
      }
      if (sort) {
        options.sort = sort.replace(/"/g, "");
      } else {
        options.sort = "-created";
      }

      const record = await pb.collection("errors").getList(1, 500, options);
      return { data: record, error: null };
    } catch (error) {
      console.error("error", error);
      return { data: null, error };
    }
  },
  getLogsInRange: async (
    pocketbase = pb,
    appId: string,
    start: string,
    end: string
  ) => {
    try {
      const records = await pocketbase.collection("errors").getList(1, 500, {
        filter: `app="${appId}" && created>="${start}" && created<="${end}"`,
        sort: "-created",
      });
      return { data: records, error: null };
    } catch (error) {
      console.error("error", error);
      return { data: null, error };
    }
  },
  getLogById: async (id: string) => {
    if (!id) return { data: null, error: "Invalid ID" };
    try {
      const record = await pb.collection("errors").getOne(id);
      return { data: record, error: null };
    } catch (error) {
      console.error("error", error);
      return { data: null, error };
    }
  },
  getLogsWithFilters: async (filters: string) => {
    try {
      const records = await pb.collection("errors").getFullList({
        sort: "-created",
        filter: filters,
      });
      return { data: records, error: null };
    } catch (error) {
      console.error("error", error);
      return { data: null, error };
    }
  },
  getIntegrationsByApp: async (pocketbase = pb, appId: string) => {
    try {
      const records = await pocketbase.collection("integrations").getFullList({
        filter: `app="${appId}"`,
        sort: "service_name",
      });
      return { data: records, error: null };
    } catch (error) {
      console.error("error", error);
      return { data: null, error };
    }
  },
  getIntegrationByName: async (name: string) => {
    try {
      const record = await pb.collection("integrations").getOne(name);
      return { data: record, error: null };
    } catch (error) {
      console.error("error", error);
      return { data: null, error };
    }
  },
  getSourceMapByFileName: async (name: string, appId: string) => {
    try {
      const record = await pb
        .collection("sourcemaps")
        .getFirstListItem(`build="${appId}" && file_name~"%${name}"`);
      return { data: record, error: null };
    } catch (error) {
      console.error("error", error);
      return { data: null, error };
    }
  },
};

export { pbGet };
