import { createArticleMetadata, NewsArticlePage } from "../NewsArticlePage";
import { getNewsArticle } from "../news-data";

const article = getNewsArticle("laptop-khong-len-nguon-nguyen-nhan-cach-xu-ly")!;
export const metadata = createArticleMetadata(article);
export default function Page() { return <NewsArticlePage article={article} />; }
