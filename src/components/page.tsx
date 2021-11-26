import { BLOCKS, Document } from '@contentful/rich-text-types';
import parse from 'html-react-parser';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { AspectRatio, Box, Heading, Image } from '@chakra-ui/react';
import { Asset } from 'contentful';

export default function Page({
  source,
  title,
  photo,
  titleProps,
  photoProps,
}: {
  source: Document;
  title: string;
  photo?: string;
  titleProps?: any;
  photoProps?: any;
}) {
  const content = documentToReactComponents(source, {
    renderNode: {
      [BLOCKS.EMBEDDED_ENTRY]: ({
        data: {
          target: { fields: image },
        },
      }: any) => {
        const float = image.encuadrar
          ? image.alineacion === 'Derecha'
            ? 'right'
            : 'left'
          : 'none';

        const width = (image.tamano ?? '100') + '%';
        const align = image.alineacion
          ? image.alineacion === 'Derecha'
            ? 'right'
            : image.alineacion === 'Centro'
            ? 'center'
            : 'left'
          : 'left';

        const ratio =
          image.imagen.fields.file.details.image.width /
          image.imagen.fields.file.details.image.height;

        let boxW,
          boxFloat: 'left' | 'right' | 'none' = 'none',
          bPl,
          bPr,
          arW,
          arMx,
          arMy,
          arMl,
          arMr;
        if (float !== 'none') {
          boxW = width;
          boxFloat = float;

          if (align === 'left') {
            bPr = 10;
          }

          if (align === 'right') {
            bPl = 10;
          }
        } else {
          boxW = '100%';
          arW = width;
          arMy = 10;
          if (align === 'center') {
            arMx = 'auto';
          }

          if (width !== '100%') {
            if (align === 'left') {
              arMr = 10;
            }

            if (align === 'right') {
              arMl = 10;
            }
          }
        }
        return (
          <Box
            sx={{ clear: 'left' }}
            float={['none', null, boxFloat]}
            w={['100%', null, boxW]}
            textAlign={align}
            pl={[0, 0, bPl ?? 0]}
            pr={[0, 0, bPr ?? 0]}
          >
            <AspectRatio
              display={float === 'none' ? 'inline-block' : 'block'}
              w={['100%', '100%', arW ?? '100%']}
              ratio={ratio}
              objectFit="contain"
              mx={[0, 0, arMx ?? 0]}
              my={[10, null, arMy ?? 0]}
              ml={arMl}
              mr={arMr}
            >
              <Image src={image.imagen.fields.file.url} />
            </AspectRatio>
          </Box>
        );
      },
      [BLOCKS.HEADING_1]: (node: any, children: any) => (
        <Heading as="h1" size="2xl" my={10}>
          {children}
        </Heading>
      ),
      [BLOCKS.HEADING_2]: (node: any, children: any) => (
        <Heading as="h2" size="xl" my={10}>
          {children}
        </Heading>
      ),
      [BLOCKS.HEADING_3]: (node: any, children: any) => (
        <Heading as="h3" size="lg" my={10}>
          {children}
        </Heading>
      ),
      [BLOCKS.HEADING_4]: (node: any, children: any) => (
        <Heading as="h4" size="md" my={10}>
          {children}
        </Heading>
      ),
      [BLOCKS.HEADING_5]: (node: any, children: any) => (
        <Heading as="h5" size="md" fontWeight="normal" my={10}>
          {children}
        </Heading>
      ),
      [BLOCKS.HEADING_6]: (node: any, children: any) => (
        <Heading as="h6" size="sm" fontWeight="normal" my={10}>
          {children}
        </Heading>
      ),
    },
  });

  return (
    <>
      <Heading size="3xl" as="h1" mb={10} {...titleProps}>
        {title}
      </Heading>
      {photo && <Image w="100%" my={10} mx="auto" src={photo} {...photoProps} />}
      <Box>{content}</Box>
    </>
  );
}
