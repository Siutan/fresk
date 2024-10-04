import { pb } from "$lib/pocketbase";

const pbDelete = {
  deleteMember: async (id: string, pocketbase = pb) => {
    try {
      const record = await pocketbase.collection("users").delete(id);
      return { data: record, error: null };
    } catch (error) {
      console.error("error", error);
      return { data: null, error };
    }
  },
};

export { pbDelete };