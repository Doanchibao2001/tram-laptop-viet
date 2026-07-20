import "server-only";

import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

const token = process.env.SANITY_WRITE_TOKEN ?? process.env.SANITY_API_TOKEN;

export const sanityServerClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  perspective: "published",
  useCdn: false,
});

export function hasSanityWriteToken(): boolean {
  return Boolean(token);
}
