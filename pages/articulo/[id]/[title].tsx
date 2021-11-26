import * as React from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { Entry, EntryCollection } from 'contentful';
import { Container, Center, Stack } from '@chakra-ui/react';
import Page from '../../../src/components/page';
import { RelatedAside } from '../../../src/components/listRelated';
import { PageInterface, Pages } from '../../../src/content/pages';
import Head from 'next/head';
import { useMergedState } from './../../../src/util/mergedStatus';
import ContentPage from './../../../src/components/ContentPage';

interface ArticlePageProps {
  article: Entry<PageInterface>;
  partners: EntryCollection<PageInterface>;
  related: EntryCollection<PageInterface>;
}

const ArticlePage: React.FunctionComponent<ArticlePageProps> = ({ article, partners, related }) => {
  const [state, setState] = useMergedState({ article, partners, related });

  React.useEffect(() => {
    async function init() {
      const dynamicProps = await fetchStaticProps({
        params: { id: article.sys.id, title: article.fields.titulo },
      });
      setState((dynamicProps as any).props);
    }
    init();
  }, [article]);

  return (
    <ContentPage related={{ partners, related }} source={article} totalPages={0} currentPage={-1} />
  );
};

const fetchStaticProps: GetStaticProps = async ({ params }) => {
  if (params) {
    const article = await Pages.get.byId(params.id as string);
    const { partners, related } = await Pages.get.relatedToPage({ page: article });

    return { props: { article, partners, related } };
  } else return { props: {} };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const articles = await Pages.get.previewAll();
  const paths = articles.items.map((article) => {
    return { params: { id: article.sys.id, title: article.fields.titulo } };
  });

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  return await fetchStaticProps({ params });
};

export default ArticlePage;
