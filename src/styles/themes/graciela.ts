import { extendTheme } from '@chakra-ui/react';
import '@fontsource/inter';
import '@fontsource/montserrat/700.css';

const Graciela = {
  initialColorMode: 'light',
  useSystemColorMode: false,

  fonts: {
    heading: 'Montserrat',
    body: 'Inter',
  },

  components: {
    Heading: {
      baseStyle: {
        fontWeight: 700,
      },
    },
  },

  styles: {
    html: {
      'scroll-behavior': 'smooth',
    },
    global: {
      'ul, ol': {
        margin: '20px',
      },
      'p a': {
        'text-decoration': 'underline',
        color: 'blue',
      },
      blockquote: {
        margin: '20px',
        paddingLeft: '20px',
        borderLeft: '4px solid #999',
      },
    },
  },
};

export default extendTheme(Graciela);
