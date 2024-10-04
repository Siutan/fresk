import type { RecordModel } from "pocketbase";

export interface Member extends RecordModel {
  id: string;
  username: string;
  avatar: string;
  name: string;
  email: string;
  access_level: string;
  status: string;
}
