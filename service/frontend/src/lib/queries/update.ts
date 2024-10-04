import { pb } from "$lib/pocketbase";

const pbUpdate = {
  updateApp: async (appId: string, data: any) => {
    try {
      const record = await pb.collection("apps").update(appId, data);
      return { data: record, error: null };
    } catch (error) {
      console.error("error", error);
      return { data: null, error };
    }
  },
  updateAssignee: async (logGroupId: string, data: any) => {
    try {
      const record = await pb.collection("error_groups").update(logGroupId, data);
      return { data: record, error: null };
    } catch (error) {
      console.error("error", error);
      return { data: null, error };
    }
  },
  updateUserAccessLevel: async (userId: string, data: any) => {
    try {
      const record = await pb.collection("users").update(userId, data);
      return { data: record, error: null };
    } catch (error) {
      console.error("error", error);
      return { data: null, error };
    }
  },
};

export { pbUpdate };
