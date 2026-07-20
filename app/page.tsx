import HomeClient from "./HomeClient";
import { getProducts, getSiteSettings } from "@/sanity/lib/content";

export const revalidate = 60;

export default async function Home() {
  const [products, siteSettings] = await Promise.all([
    getProducts(),
    getSiteSettings(),
  ]);

  return <HomeClient products={products} siteSettings={siteSettings} />;
}
