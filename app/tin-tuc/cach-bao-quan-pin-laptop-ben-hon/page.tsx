import { metadataForArticle, renderArticle } from "../NewsArticleRoute";

const slug = "cach-bao-quan-pin-laptop-ben-hon";
export function generateMetadata() { return metadataForArticle(slug); }
export default async function Page() { return renderArticle(slug); }
