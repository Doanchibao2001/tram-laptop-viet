import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  perspective: "published",
  // Read the published Content Lake directly so an editor's changes are not
  // hidden behind the previous CDN snapshot.
  useCdn: false,
});
