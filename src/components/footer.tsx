import {
  Box,
  Container,
  Flex,
  Heading,
  HStack,
  Image,
  VStack,
  Text,
  Spacer,
  Center,
  Stack,
  AspectRatio,
} from '@chakra-ui/react';
import { Asset, Entry } from 'contentful';
import React, { ReactElement } from 'react';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { Document } from '@contentful/rich-text-types';
import { ContactInformation } from '../content/contact';
import { IconType } from 'react-icons';
import { LinkedRow } from '../util/icons';

export type FooterDescription = {
  titulo: string;
  descripcion: Document;
};

export type FooterProps = {
  profile: Asset;
  description: Entry<FooterDescription>;
  contact: ContactInformation;
};

const Footer: React.FunctionComponent<FooterProps> = (props) => {
  const aspectRatio =
    (props as any).profile.fields.file.details.image!.width /
    (props as any).profile.fields.file.details.image!.height;
  return (
    <Box as="footer" id="Footer" bgColor="#000b3d" color="white">
      <Container maxW="container.xl" py={10}>
        <Flex
          h="100%"
          direction={['column', null, 'row']}
          justifyContent="center"
          alignItems="center"
        >
          <Stack h="100%" direction={['column', null, 'row']}>
            <AspectRatio ratio={aspectRatio} mr={10} minW="13vw">
              <Image src={props.profile.fields.file.url} />
            </AspectRatio>
            <VStack alignItems="start" justifyContent="center">
              <Heading size="xl">{props.description.fields.titulo}</Heading>
              <Box
                lineHeight={8}
                dangerouslySetInnerHTML={{
                  __html: documentToHtmlString(props.description.fields.descripcion),
                }}
              />
            </VStack>
          </Stack>
          <Spacer></Spacer>
          <VStack justifyContent="center" alignItems="center" mt={[10, null, 0]}>
            <Heading size="lg">Contacto</Heading>
            {props.contact.phones.items.map((phone) => (
              <LinkedRow
                key={phone.fields.numero}
                type={phone.fields.whatsapp ? 'whatsapp' : 'phone'}
                label={phone.fields.nombre}
              >
                {phone.fields.numero}
              </LinkedRow>
            ))}
            {props.contact.addresses.items.map((address) => (
              <LinkedRow
                key={address.fields.nombre}
                type="address"
                label={address.fields.nombre}
                url={address.fields.url}
              >
                {address.fields.direccion}
              </LinkedRow>
            ))}
            {props.contact.externals.items.map((external) => (
              <LinkedRow
                key={external.fields.nombre}
                type={external.fields.tipo.fields.valor as any}
                label={external.fields.nombre}
                url={external.fields.enlace}
              >
                {external.fields.enlace}
              </LinkedRow>
            ))}
          </VStack>
        </Flex>
      </Container>
    </Box>
  );
};

export default Footer;
