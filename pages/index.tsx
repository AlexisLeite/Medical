import {
  AspectRatio,
  Box,
  BoxProps,
  Button,
  Center,
  Container,
  Flex,
  Heading,
  HStack,
  Image,
  ImageProps,
  ScaleFade,
  Spacer,
  Stack,
  Text,
  useColorMode,
  VStack,
} from '@chakra-ui/react';
import { EntryCollection } from 'contentful';
import type { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import React from 'react';
import HomeApproach from '../src/components/homeApproach';
import { Approach } from '../src/content/approaches';

type HomeProps = {
  approaches: EntryCollection<Approach>;
};

const Home: NextPage<HomeProps> = (props: HomeProps) => {
  return (
    <>
      <Head>
        <title>Medicina integral</title>
      </Head>
      <Container maxW="container.xl">
        <VStack spacing={20} my={20}>
          {props.approaches.items.map((item, index) => (
            <HomeApproach
              key={item.fields.titulo}
              item={item}
              orientation={index % 2 === 0 ? 'left' : 'right'}
            />
          ))}
        </VStack>
      </Container>
    </>
  );
};

export default Home;
