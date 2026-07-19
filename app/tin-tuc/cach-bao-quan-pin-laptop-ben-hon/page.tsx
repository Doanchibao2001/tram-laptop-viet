import { createArticleMetadata, NewsArticlePage } from "../NewsArticlePage";
import { getNewsArticle } from "../news-data";

const article = getNewsArticle("cach-bao-quan-pin-laptop-ben-hon")!;
export const metadata = createArticleMetadata(article);
export default function Page() { return <NewsArticlePage article={article} />; }
