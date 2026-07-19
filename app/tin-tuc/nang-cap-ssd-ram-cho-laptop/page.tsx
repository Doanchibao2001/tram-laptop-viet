import { createArticleMetadata, NewsArticlePage } from "../NewsArticlePage";
import { getNewsArticle } from "../news-data";

const article = getNewsArticle("nang-cap-ssd-ram-cho-laptop")!;
export const metadata = createArticleMetadata(article);
export default function Page() { return <NewsArticlePage article={article} />; }
