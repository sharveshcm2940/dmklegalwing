import { NEWS_ITEMS } from '@/data/content';
import ArticleView from './ArticleView';

export function generateStaticParams() {
  return NEWS_ITEMS.map((item) => ({
    id: item.id,
  }));
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ArticleView articleId={id} />;
}
