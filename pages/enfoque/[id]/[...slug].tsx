import * as React from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { Approach, Approaches } from '../../../src/content/approaches';
import { Entry, EntryCollection } from 'contentful';
import { PageInterface, Pages } from '../../../src/content/pages';
import { useMergedState } from '../../../src/util/mergedStatus';
import ContentPage from '../../../src/components/ContentPage';
import Conf from './../../../src/util/conf';

interface FocusPageProps {
  approach: Entry<Approach>;
  partners: EntryCollection<PageInterface>;
  related: EntryCollection<PageInterface>;
  articles: EntryCollection<PageInterface>;
  currentPage: number;
  articlePages: number;
}

const FocusPage: React.FunctionComponent<FocusPageProps> = ({
  articles,
  approach,
  partners,
  related,
  currentPage,
  articlePages,
}) => {
  const [state, setState] = useMergedState({ approach, partners, related });

  React.useEffect(() => {
    async function init() {
      const dynamicProps = await fetchStaticProps({
        params: { id: approach.sys.id, title: approach.fields.titulo },
      });
      setState((dynamicProps as any).props);
    }
    init();
  }, [approach]);
  return (
    <ContentPage
      articles={articles}
      source={state.approach}
      related={{ related, partners }}
      currentPage={currentPage}
      totalPages={articlePages}
    />
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const approaches = await Approaches.get.previewAll();

  const paths = [];

  for (let approach of approaches.items) {
    paths.push({ params: { id: approach.sys.id, slug: [approach.fields.titulo] } });

    const pages = await Pages.get.relatedToFocus({
      page: approach,
      limitRelated: 0,
      limitPartners: 1,
    });
    const totalCount = pages.partners ? pages.partners.total : 0;
    const totalPages = Math.ceil(totalCount / Conf.pages.articlesPerPage);
    for (let i = 0; i < totalPages; i++)
      paths.push({
        params: {
          id: approach.sys.id,
          slug: [approach.fields.titulo, `${i}`],
        },
      });
  }

  return {
    paths,
    fallback: false,
  };
};

export const fetchStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params && Array.isArray(params.slug) ? params.slug : [];
  const [, page] = slug;
  if (params) {
    const approach = await Approaches.get.byId(params.id as string);
    const { partners, related } = await Pages.get.relatedToFocus({ page: approach });
    const articles = await Pages.get.relatedToFocus({
      page: approach,
      limitRelated: 0,
      limitPartners: Conf.pages.articlesPerPage,
      skipPartners: (page ? parseInt(page) : 0) * Conf.pages.articlesPerPage,
    });
    return {
      props: {
        approach,
        partners,
        related,
        articles: articles.partners,
        articlePages: Math.ceil(
          (articles.partners ? articles.partners.total : 0) / Conf.pages.articlesPerPage
        ),
        currentPage: parseInt(page ?? 0),
      },
    };
  } else return { props: {} };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  return await fetchStaticProps({ params });
};

export default FocusPage;
