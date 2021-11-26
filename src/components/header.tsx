import * as React from 'react';
import {
  Center,
  Heading,
  HStack,
  Image,
  VStack,
  Flex,
  Stack,
  Link,
  LinkBox,
  LinkOverlay,
  Divider,
  useDisclosure,
  SliderTrack,
  Spacer,
  useBreakpointValue,
  Button,
  Icon,
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { TiThMenu } from 'react-icons/ti';
import NextLink from 'next/link';
import { Approach, Approaches } from '../content/approaches';
import { EntryCollection } from 'contentful';
import { useMergedState } from './../util/mergedStatus';
import { Router } from 'next/router';

interface IHeaderProps {
  approaches: EntryCollection<Approach>;
}

function CommonLinks(props: any) {
  const centerStyles = props.isOpen
    ? {
        order: 2,
      }
    : {
        order: [2, null, 1],
      };
  const commonStackStyles = {
    pl: [0, null, 2, 10, 20],
    justifyContent: ['center'],
    alignItems: 'start',
    w: ['90vw', null, '20vw'],
  };
  const stackStyles = props.isOpen
    ? {
        direction: ['column', null, 'row'],
        whiteSpace: 'nowrap',
      }
    : {
        direction: 'column',
      };
  return (
    <Center {...centerStyles}>
      <Stack {...(commonStackStyles as any)} {...(stackStyles as any)}>
        <NextLink href="/" passHref>
          <Link px={[0, null, 2]}>Inicio</Link>
        </NextLink>
        <NextLink href="/sobre-mi" passHref>
          <Link px={[0, null, 2]}>Sobre mi</Link>
        </NextLink>
        <NextLink href="#Footer" passHref>
          <Link px={[0, null, 2]}>Contacto</Link>
        </NextLink>
        <Divider display={['block', null, 'none']} />
      </Stack>
    </Center>
  );
}
function CustomLinks({
  approaches,
  isOpen,
}: {
  approaches: EntryCollection<Approach>;
  isOpen: boolean;
}) {
  const asMenu = useBreakpointValue({ base: false, md: true, xl: false });
  const centerStyles = { order: 3, m: 3 };
  const sharedStackStyles = { alignItems: ['start', null, 'end'] };
  const stackStyles = isOpen
    ? {
        direction: ['column', null, 'row'],
        w: ['90vw', null, '100%'],
        pr: 0,
      }
    : {
        direction: 'column',
        w: ['90vw', null, '20vw'],
        pr: [0, null, 2, 10, 20],
      };
  return (
    <Center {...centerStyles}>
      {asMenu && isOpen ? (
        <Menu>
          <MenuButton
            variant="ghost"
            as={Button}
            _expanded={{ bg: 'none' }}
            _hover={{ bg: '#fff2' }}
            _active={{ bg: '#fff2' }}
            _focus={{ bg: '#fff2' }}
          >
            Enfoques terapéuticos
          </MenuButton>
          <MenuList color="blue.800">
            {approaches.items.map((approach) => (
              <MenuItem>
                <NextLink
                  passHref
                  href={`/enfoque/${approach.sys.id}/${approach.fields.titulo}`}
                  key={approach.sys.id}
                  scroll={false}
                >
                  <Link whiteSpace="nowrap" textAlign={['center', null, 'right']}>
                    {approach.fields.titulo}
                  </Link>
                </NextLink>
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      ) : (
        <Stack {...(sharedStackStyles as any)} {...(stackStyles as any)}>
          {approaches.items.map((approach) => (
            <NextLink
              passHref
              href={`/enfoque/${approach.sys.id}/${approach.fields.titulo}`}
              key={approach.sys.id}
              scroll={false}
            >
              <Link
                whiteSpace="nowrap"
                px={[0, null, 2]}
                textAlign={['center', null, 'right']}
                py={isOpen ? [0, null, 3] : 0}
              >
                {approach.fields.titulo}
              </Link>
            </NextLink>
          ))}
        </Stack>
      )}
    </Center>
  );
}
function Logo({ isOpen }: { isOpen: boolean }) {
  const OpenSource = useBreakpointValue({
    base: '/images/logo200x199.png',
    md: '/images/logo32x32.png',
  });
  const linkBoxStyles = isOpen
    ? { order: 1, spacing: 8, p: [10, null, 0], ml: 4 }
    : { order: [1, null, 2], w: '100%', spacing: 8, p: 10 };
  const stackStyles = isOpen
    ? { direction: ['column', null, 'row'], h: '100%', alignItems: 'center' }
    : { w: '100%', alignItems: 'center' };
  const imageStyles = isOpen
    ? {
        m: 0,
        src: OpenSource,
        w: ['60%', '40%', '28px'],
      }
    : { m: 0, src: '/images/logo200x199.png', w: 150 };
  const headingStyles = isOpen
    ? { whiteSpace: 'nowrap', fontSize: ['3xl', '3xl', 'xl'], as: 'h1', color: '#ffffea' }
    : {
        whiteSpace: 'nowrap',
        fontSize: ['xl', 'xl', '3xl', '4xl', '6xl'],
        as: 'h1',
        color: '#ffffea',
      };
  const centerStyles = isOpen ? { w: ['100%', '80%', '60px'] } : {};
  return (
    <LinkBox {...(linkBoxStyles as any)}>
      <Stack {...(stackStyles as any)}>
        <Center {...(centerStyles as any)}>
          <Image {...imageStyles} />
        </Center>
        <Heading {...(headingStyles as any)}>
          <NextLink passHref href="/">
            <LinkOverlay>Medicina integral</LinkOverlay>
          </NextLink>
        </Heading>
      </Stack>
    </LinkBox>
  );
}

const Header: React.FunctionComponent<IHeaderProps> = ({ approaches }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: showMenu, onToggle: toggleMenu, onClose: closeMenu } = useDisclosure();
  const mediumWidth = useBreakpointValue({ base: false, md: true });

  React.useEffect(() => {
    const handleRouteChange = () => closeMenu();
    Router.events.on('routeChangeComplete', handleRouteChange);
    Router.events.on('routeChangeError', handleRouteChange);
    // Put the
    const header = document.getElementById('Header') as HTMLElement;
    const headerHeight = header.getBoundingClientRect().height;
    const handleScroll = () => {
      if (header)
        if (header.offsetTop + header.getBoundingClientRect().height < window.scrollY) {
          onOpen();
        } else {
          onClose();
        }
      else if (window.scrollY < headerHeight) onClose();
    };
    window.addEventListener('scroll', handleScroll);

    // Close the menu on press Escape
    const handleEscape = (ev: KeyboardEvent) => ev.key === 'Escape' && closeMenu();
    window.addEventListener('keydown', handleEscape);

    // Close the menu when clicking the body
    function isChildOf(element: HTMLElement, target: HTMLElement) {
      do {
        if (element === target) return true;
        element = element.parentElement as HTMLElement;
      } while (element?.parentElement);

      return false;
    }

    const handleClick = (ev: MouseEvent) => {
      if (
        !(
          (ev.target &&
            isChildOf(
              ev.target as HTMLElement,
              document.getElementById('FloatingHeader') as HTMLElement
            )) ||
          isChildOf(ev.target as HTMLElement, document.getElementById('MenuHandler') as HTMLElement)
        )
      )
        closeMenu();
    };
    window.addEventListener('click', handleClick);

    return () =>
      void window.removeEventListener('scroll', handleScroll) ||
      void window.removeEventListener('keydown', handleEscape) ||
      void window.removeEventListener('click', handleClick) ||
      void Router.events.off('routeChangeComplete', handleRouteChange) ||
      void Router.events.off('routeChangeError', handleRouteChange);
  }, [approaches]);

  // Focus the menu button when it appears
  const showButtonRef = React.createRef<HTMLButtonElement>();
  React.useEffect(() => {
    if (isOpen) showButtonRef.current?.focus();
  }, [isOpen]);

  const positionStyles = isOpen ? {} : {};

  return (
    <>
      {isOpen && (
        <Button
          id="MenuHandler"
          display={['block', null, 'none']}
          position="fixed"
          top={10}
          right={10}
          bg="white"
          color="blue.800"
          border="1px solid"
          borderColor="blue.800"
          onClick={() => {
            toggleMenu();
          }}
          tabIndex={0}
          zIndex={150}
          ref={showButtonRef}
        >
          <Icon as={TiThMenu} />
        </Button>
      )}
      <Flex
        as="header"
        w="100%"
        bgColor="#000b3d"
        color="white"
        justify="center"
        direction={['column', null, 'row']}
        id="Header"
        {...(positionStyles as any)}
      >
        <Logo isOpen={false} />
        {isOpen && <Spacer order={2} />}
        <CommonLinks isOpen={false} />
        {isOpen && <Spacer order={2} />}
        <CustomLinks approaches={approaches} isOpen={false} />
      </Flex>
      <Flex
        id="FloatingHeader"
        position="fixed"
        top={0}
        as="header"
        w="100%"
        bgColor="#000b3d"
        color="white"
        justify="center"
        direction={['column', null, 'row']}
        zIndex={100}
        {...(positionStyles as any)}
        overflow={['auto', null, 'visible']}
        maxH="100vh"
        display={isOpen && (showMenu || mediumWidth) ? 'flex' : 'none'}
      >
        <Logo isOpen={isOpen} />
        {isOpen && <Spacer order={2} />}
        <CommonLinks isOpen={isOpen} />
        {isOpen && <Spacer order={2} />}
        <CustomLinks approaches={approaches} isOpen={isOpen} />
      </Flex>
    </>
  );
};

export default Header;
