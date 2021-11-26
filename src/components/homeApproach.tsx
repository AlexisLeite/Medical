import {
  Box,
  BoxProps,
  Center,
  Heading,
  Image,
  LinkBox,
  LinkOverlay,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Entry } from 'contentful';
import { HTMLMotionProps, motion } from 'framer-motion';
import { useRef } from 'react';
import { useInViewport } from 'react-in-viewport';
import { Approach } from '../content/approaches';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import NextLink from 'next/link';

const AnimationBox = motion<BoxProps & HTMLMotionProps<'div'>>(Box);

export interface ApproachProps {
  item: Entry<Approach>;
  orientation: 'left' | 'right';
}
export default function HomeApproach({ item, orientation }: ApproachProps) {
  const ref = useRef();
  const { enterCount } = useInViewport(ref);

  const animations = {
    image: {
      initial: {
        scale: 0.5,
        opacity: 0,
      },
      inViewport: {
        scale: 1,
        opacity: 1,
      },
    },
    text: {
      left: {
        initial: {
          x: -15,
          y: -15,
          opacity: 0,
          scale: 0.8,
        },
        inViewport: {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
        },
      },
      right: {
        initial: {
          x: 15,
          y: 15,
          opacity: 0,
          scale: 0.8,
        },
        inViewport: {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
        },
      },
    },
  };
  const sufix = orientation === 'left' ? '' : '-reverse';

  return (
    <LinkBox>
      <VStack spacing={[0, null, 10]}>
        <NextLink scroll={false} href={`/enfoque/${item.sys.id}/${item.fields.titulo}`} passHref>
          <LinkOverlay>
            <Heading textAlign="center">{item.fields.titulo}</Heading>
          </LinkOverlay>
        </NextLink>
        <Stack direction={[`column`, null, `row${sufix}`]} w="100%" spacing={[0, null, 10]}>
          <Center>
            <AnimationBox
              w={['80vw', null, '30vw', null, '20vw']}
              m={[10, null, 10]}
              initial={animations.image.initial}
              animate={enterCount > 0 && animations.image.inViewport}
              transition={{ duration: 0.55, ease: 'easeIn' } as any}
            >
              <Image
                w={['80vw', null, '30vw', null, '20vw']}
                ref={ref as any}
                src={item.fields.portada.fields.file.url}
              />
            </AnimationBox>
          </Center>
          <Center w="100%">
            <AnimationBox
              initial={
                orientation === 'left'
                  ? animations.text.left.initial
                  : animations.text.right.initial
              }
              animate={
                enterCount > 0 &&
                (orientation === 'left'
                  ? animations.text.left.inViewport
                  : animations.text.right.inViewport)
              }
              transition={{ duration: 0.55, ease: 'easeIn' } as any}
            >
              <Text
                as="div"
                px={[10, null, 0]}
                dangerouslySetInnerHTML={{ __html: documentToHtmlString(item.fields.descripcion) }}
              ></Text>
            </AnimationBox>
          </Center>
        </Stack>
      </VStack>
    </LinkBox>
  );
}
