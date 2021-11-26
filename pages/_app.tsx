import type { AppProps } from 'next/app';
import Layout from '../src/components/layout';
import { NextComponentType, NextPageContext } from 'next';
import { ReactElement } from 'react';
import layoutProps from '../src/util/focus.preval';
import Router from 'next/router';
import NProgress from 'nprogress'; //nprogress module
import 'nprogress/nprogress.css'; //styles of nprogress
import '../src/styles/custom.css';

const handleRouteChange = () => {
  NProgress.done();
};

//Binding events.
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', handleRouteChange);
Router.events.on('routeChangeError', handleRouteChange);

type NextComponentTypeWithLayout<P = {}> = NextComponentType<NextPageContext, any, P> & {
  getLayout?: (page: ReactElement) => ReactElement;
};

type AppWithLayoutProps<P = {}> = AppProps & {
  Component: NextComponentTypeWithLayout;
};

function MyApp({ Component, pageProps }: AppWithLayoutProps) {
  return (
    <Layout {...layoutProps}>
      <Component {...layoutProps} {...pageProps} />
    </Layout>
  );
}
export default MyApp;
