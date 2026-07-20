import { metadataForArticle, renderArticle } from "../NewsArticleRoute";

const slug = "laptop-khong-len-nguon-nguyen-nhan-cach-xu-ly";
export function generateMetadata() { return metadataForArticle(slug); }
export default async function Page() { return renderArticle(slug); }
