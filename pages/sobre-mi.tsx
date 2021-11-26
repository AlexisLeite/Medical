import React, { ReactElement } from 'react';
import { getLayoutProps } from '../src/util/getLayoutProps';
import { GetStaticProps } from 'next';
import Layout, { LayoutProps } from '../src/components/layout';
import Head from 'next/head';
import { Container, Heading, Box, Image, AspectRatio, chakra } from '@chakra-ui/react';
import { client } from '../src/content/client';
import { Entry } from 'contentful';
import { Document } from '@contentful/rich-text-types';
import Page from '../src/components/page';

interface AboutProps {
  about: Entry<Page>;
}

function About({ about }: AboutProps): ReactElement {
  return (
    <>
      <Head>
        <title>Dra. Fernanda Alberti Schopenhauer - Medicina integral</title>
      </Head>
      <Container maxW="container.xl">
        <Page source={about.fields.cuerpo} title={about.fields.titulo} />
      </Container>
    </>
  );
}

interface Page {
  titulo: string;
  cuerpo: Document;
}

export const getStaticProps: GetStaticProps = async (context) => {
  const about = await client.getEntry<Page>('DCRwzS2UIXeKp3MoA84BY');
  return { props: { about } };
};

export default About;
