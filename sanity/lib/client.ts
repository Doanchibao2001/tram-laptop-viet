import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  perspective: "published",
  // Public reads use Sanity's CDN. The webhook invalidates Next.js data when
  // editors publish, while the short revalidation window is a safe fallback.
  useCdn: true,
});
