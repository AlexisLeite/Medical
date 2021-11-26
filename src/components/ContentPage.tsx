import {
  Box,
  Center,
  Container,
  Heading,
  propNames,
  Stack,
  VStack,
  Text,
  LinkBox,
  LinkOverlay,
  HStack,
  Link,
  Button,
} from '@chakra-ui/react';
import * as React from 'react';
import Head from 'next/head';
import { RelatedAside } from './listRelated';
import Page from './page';
import { Entry, EntryCollection } from 'contentful';
import { Approach } from '../content/approaches';
import { PageInterface, Pages } from '../content/pages';
import { useMergedState } from './../util/mergedStatus';
import Conf from './../util/conf';
import NextLink from 'next/link';

interface IContentPageProps extends SharedPaginationProps {
  articles?: EntryCollection<PageInterface>;
  source: Entry<Approach | PageInterface>;
  related: { partners: EntryCollection<PageInterface>; related: EntryCollection<PageInterface> };
}

interface SharedPaginationProps {
  currentPage: number;
  totalPages: number;
}
interface PaginationProps extends SharedPaginationProps {
  linkLayout: string; // The way the link is formed "/home/posts/{PAGE}" the {PAGE} element will be replaced
}

function PaginationElement({
  href,
  label,
  current,
}: {
  href: string;
  label: string;
  current?: boolean;
}) {
  if (current)
    return (
      <Button bg="blue.50" as="a" variant="outline">
        {label}
      </Button>
    );
  return (
    <NextLink href={href} scroll={false} passHref>
      <Button as="a" variant="outline">
        {label}
      </Button>
    </NextLink>
  );
}
function Pagination({ totalPages, currentPage, linkLayout }: PaginationProps) {
  let Pages;
  function parseLink(pageNumber: number) {
    return linkLayout.replace('{PAGE}', `${pageNumber}`);
  }
  Pages = [];
  if (totalPages <= Conf.pagination.links) {
    for (let i = 0; i < totalPages; i++)
      Pages.push(
        <PaginationElement
          key={i}
          href={parseLink(i)}
          label={`${i + 1}`}
          current={i === currentPage}
        />
      );
  } else {
    Pages.push(
      <PaginationElement key={0} href={parseLink(0)} label="1" current={currentPage === 0} />
    );

    for (
      let i = Math.max(currentPage - (Conf.pagination.links - 2) / 2, 1);
      i < Math.min(currentPage + (Conf.pagination.links - 2) / 2 + 1, totalPages - 1);
      i++
    ) {
      Pages.push(
        <PaginationElement
          key={i}
          href={parseLink(i)}
          label={`${i + 1}`}
          current={currentPage === i}
        />
      );
    }

    Pages.push(
      <PaginationElement
        key={totalPages - 1}
        href={parseLink(totalPages - 1)}
        label={`${totalPages}`}
        current={currentPage === totalPages - 1}
      />
    );
  }
  return <HStack as="nav">{Pages}</HStack>;
}

const ContentPage: React.FunctionComponent<IContentPageProps> = ({
  articles,
  related,
  source,
  totalPages,
  currentPage,
}) => {
  const [state, setState] = useMergedState({
    partners: { ...related.partners },
    related: { ...related.related },
    loadingRelated: false,
    loadingPartners: false,
  });

  React.useEffect(() => {
    setState({
      partners: { ...related.partners },
      related: { ...related.related },
      loadingRelated: false,
      loadingPartners: false,
    });
  }, [related.partners, related.related]);

  function isPage(page: Entry<any>): page is Entry<PageInterface> {
    if (page.sys.contentType.sys.id === 'pagina') return true;
    return false;
  }

  const content = 'cuerpo' in source.fields ? source.fields.cuerpo : source.fields.descripcion;
  const photo = 'portada' in source.fields ? source.fields.portada.fields.file.url : undefined;

  return (
    <Center>
      <Head>
        <title>{source.fields.titulo} - Medicina Integral</title>
      </Head>
      <Stack mx="auto" alignItems="start" direction={['column', null, null, 'row-reverse']}>
        <RelatedAside
          onAskMoreRelated={async () => {
            setState({ loadingRelated: true });
            const skip = state.related.skip + state.related.limit;
            const morePages = isPage(source)
              ? await Pages.get.relatedToPage({
                  page: source,
                  limitPartners: 0,
                  limitRelated: 10,
                  skipRelated: skip,
                })
              : await Pages.get.relatedToFocus({
                  page: source as Entry<Approach>,
                  limitPartners: 0,
                  limitRelated: 10,
                  skipRelated: skip,
                });

            const newRelated = {
              ...(morePages.related as EntryCollection<PageInterface>),
              limit: state.related.limit + 10,
              skip,
              items: [
                ...state.related.items,
                ...(morePages.related as EntryCollection<PageInterface>).items,
              ],
            };

            setState({ related: newRelated, loadingRelated: false });
          }}
          onAskMore={async () => {
            setState({ loadingPartners: true });
            const skip = state.partners.skip + state.partners.limit;
            const morePages = isPage(source)
              ? await Pages.get.relatedToPage({
                  page: source,
                  limitRelated: 0,
                  limitPartners: 10,
                  skipPartners: skip,
                })
              : await Pages.get.relatedToFocus({
                  page: source as Entry<Approach>,
                  limitRelated: 0,
                  limitPartners: 10,
                  skipPartners: skip,
                });

            const newPartners = {
              ...(morePages.partners as EntryCollection<PageInterface>),
              limit: state.partners.limit + 10,
              skip,
              items: [
                ...state.partners.items,
                ...(morePages.partners as EntryCollection<PageInterface>).items,
              ],
            };

            setState({ partners: newPartners, loadingPartners: false });
          }}
          loadingRelated={state.loadingRelated}
          loadingPartners={state.loadingPartners}
          partners={state.partners}
          related={state.related}
        ></RelatedAside>
        <Container as="article" maxW="container.lg">
          <Page title={source.fields.titulo} source={content} photo={photo} />
          {articles && (
            <Box as="nav">
              {articles.items.map((article) => {
                let content;
                loop: for (let block of article.fields.cuerpo.content) {
                  if (block.nodeType === 'paragraph')
                    for (let node of block.content) {
                      if (node.nodeType === 'text') {
                        content = node.value;
                        break loop;
                      }
                    }
                }
                if (!content) content = 'Documento sin contenido';
                if (content.length > 200) {
                  let contentCopy = content.split(' ');
                  content = '';
                  for (let word of contentCopy) {
                    content += word + ' ';
                    if (content.length > 200) {
                      content += '...';
                      break;
                    }
                  }
                }
                return (
                  <VStack
                    my={5}
                    key={article.sys.id}
                    border="1px solid black"
                    borderColor="blue.200"
                  >
                    <LinkBox
                      variant="ghost"
                      _hover={{
                        bgColor: 'blue.50',
                      }}
                      _focus={{
                        bgColor: 'blue.50',
                      }}
                      p={10}
                    >
                      <NextLink
                        href={`/articulo/${article.sys.id}/${article.fields.titulo}`}
                        passHref
                        scroll={true}
                      >
                        <LinkOverlay>
                          <Heading w="100%" as="h3" size="md" pb={4}>
                            {article.fields.titulo}
                          </Heading>
                        </LinkOverlay>
                      </NextLink>
                      <Text>{content}</Text>
                    </LinkBox>
                  </VStack>
                );
              })}
            </Box>
          )}
          {!isPage(source) && (
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              linkLayout={`/enfoque/${source.sys.id}/${source.fields.titulo}/{PAGE}`}
            />
          )}
        </Container>
      </Stack>
    </Center>
  );
};

export default ContentPage;
