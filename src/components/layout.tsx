import {
  ChakraProvider,
  extendTheme,
  useColorMode,
  Box,
  AspectRatio,
  Container,
} from '@chakra-ui/react';
import { Entry, EntryCollection } from 'contentful';
import React, { ReactElement } from 'react';
import { Approach } from '../content/approaches';
import graciela from '../styles/themes/graciela';
import Header from './header';
import TopBox from './topBox';
import Footer, { FooterProps } from './footer';
import Map from './map';
import { ContactInformation } from '../content/contact';
import { useMergedState } from './../util/mergedStatus';
import { getLayoutProps } from '../util/getLayoutProps';

export type LayoutProps = FooterProps & {
  children?: ReactElement[] | ReactElement | string;
  approaches: EntryCollection<Approach>;
};

const config = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

useColorMode;

const theme = extendTheme({ config });

export default function Layout({
  children,
  approaches,
  description,
  profile,
  contact,
}: LayoutProps): ReactElement {
  const [state, setState] = useMergedState({
    approaches,
    description,
    profile,
    contact,
  });

  React.useEffect(() => {
    async function init() {
      const layoutProps = await getLayoutProps();
      setState(layoutProps);
    }
    init();
    window.addEventListener('scroll', (ev) => {});
  }, []);

  return (
    <ChakraProvider theme={graciela}>
      <TopBox contact={state.contact} />
      <Header approaches={state.approaches} />
      <Box as="main" py={[10, null, 16, 24, 32]}>
        {children}
      </Box>
      <Footer description={state.description} profile={state.profile} contact={state.contact} />
    </ChakraProvider>
  );
}
