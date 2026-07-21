import HomeClient from "./HomeClient";
import MobileMotionV3 from "./MobileMotionV3";
import { getProducts, getSiteSettings } from "@/sanity/lib/content";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [products, siteSettings] = await Promise.all([
    getProducts(),
    getSiteSettings(),
  ]);

  return (
    <>
      <MobileMotionV3 />
      <HomeClient products={products} siteSettings={siteSettings} />
    </>
  );
}
