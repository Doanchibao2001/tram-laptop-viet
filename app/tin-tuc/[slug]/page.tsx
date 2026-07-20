import { metadataForArticle, renderArticle } from "../NewsArticleRoute";

type ArticleRouteProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 60;

export async function generateMetadata({ params }: ArticleRouteProps) {
  const { slug } = await params;
  return metadataForArticle(slug);
}

export default async function Page({ params }: ArticleRouteProps) {
  const { slug } = await params;
  return renderArticle(slug);
}
