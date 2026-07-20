import { metadataForArticle, renderArticle } from "../NewsArticleRoute";

const slug = "nang-cap-ssd-ram-cho-laptop";
export function generateMetadata() { return metadataForArticle(slug); }
export default async function Page() { return renderArticle(slug); }
