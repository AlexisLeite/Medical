import NextLink from 'next/link';
import {
  Box,
  Button,
  Divider,
  Heading,
  Link,
  ListItem,
  Skeleton,
  Stack,
  UnorderedList,
  VStack,
} from '@chakra-ui/react';
import { EntryCollection } from 'contentful';
import { PageInterface } from '../content/pages';
import React from 'react';

function AsideSkeleton() {
  return (
    <Stack w="100%" spacing="20px" alignItems="center" pb={10}>
      <Skeleton height="20px" width="80%" borderRadius="5px"></Skeleton>
      <Skeleton height="20px" width="80%" borderRadius="5px"></Skeleton>
      <Skeleton height="20px" width="80%" borderRadius="5px"></Skeleton>
    </Stack>
  );
}

export function RelatedAside({
  partners,
  related,
  onAskMore,
  onAskMoreRelated,
  loadingPartners,
  loadingRelated,
}: {
  partners: EntryCollection<PageInterface>;
  related: EntryCollection<PageInterface>;
  onAskMore: () => void;
  onAskMoreRelated: () => void;
  loadingPartners: boolean;
  loadingRelated: boolean;
}) {
  return (
    <VStack
      w={['80%', '90%', null, '300px', '400px']}
      mr={['auto', null, null, 10]}
      ml={10}
      mb={10}
      pr={['auto', null, null, 10]}
      alignItems="start"
      spacing={4}
      bg={['gray.50', null, null, 'none']}
      p={[4, 8, 10]}
      border={['1px solid #333', null, null, 'none']}
      as="aside"
    >
      <Heading as="h2" size="md" mt={4}>
        Entradas relacionadas
      </Heading>
      <Divider borderBottomColor={['gray.800', null, 'gray.300']} />
      <ListRelated related={partners} />
      {loadingPartners && <AsideSkeleton />}
      {partners.limit + partners.skip < partners.total && (
        <Button variant="link" onClick={onAskMore}>
          Mostrar más
        </Button>
      )}
      <Heading as="h2" size="md" pt={10}>
        Podría interesarte
      </Heading>
      <Divider borderBottomColor={['gray.800', null, 'gray.300']} />
      <ListRelated pb={0} related={related} />
      {loadingRelated && <AsideSkeleton />}
      {related.limit + related.skip < related.total && (
        <Button variant="link" onClick={onAskMoreRelated}>
          Mostrar más
        </Button>
      )}
    </VStack>
  );
}

export function ListRelated({
  related,
  ...props
}: {
  related: EntryCollection<PageInterface>;
  [key: string]: any;
}) {
  return related.items.length ? (
    <Box as="nav" mt="0 !important">
      <UnorderedList className="Triangle" pb={0} {...props}>
        {related.items.map((page) => (
          <NextLink
            key={page.sys.id}
            passHref
            href={`/articulo/${page.sys.id}/${page.fields.titulo}`}
            scroll={false}
          >
            <Link
              p={1}
              boxShadow="0 0 0 0 transparent !important"
              display="block"
              _focus={{
                textDecor: 'underline',
                border: '3px solid black',
                borderColor: 'blue.200',
                borderRadius: '10px',
                overflow: 'hidden',
              }}
            >
              <ListItem ml={[4, 8, 10]} key={page.sys.id}>
                {page.fields.titulo}
              </ListItem>
            </Link>
          </NextLink>
        ))}
      </UnorderedList>
    </Box>
  ) : (
    <></>
  );
}

export default ListRelated;
