import { PUBLIC_POCKETBASE_URL } from "$env/static/public";
import PocketBase from "pocketbase";

export function createInstance() {
  return new PocketBase(PUBLIC_POCKETBASE_URL);
}

export async function getFileUrl(
  collectionName: string,
  recordId: string,
  fileName: string
) {
  return `${PUBLIC_POCKETBASE_URL}/api/files/${collectionName}/${recordId}/${fileName}`;
}

export const pb = createInstance();
