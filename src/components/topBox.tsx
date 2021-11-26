import { Box, Button, Container, Flex, HStack, Spacer, Stack, Text } from '@chakra-ui/react';
import * as React from 'react';
import { FaFacebook, FaWhatsapp } from 'react-icons/fa';
import { ContactInformation } from '../content/contact';

interface ITopBoxProps {
  contact: ContactInformation;
}

const TopBox: React.FunctionComponent<ITopBoxProps> = (props) => {
  const whatsapp = props.contact.phones.items.filter((phone) => phone.fields.whatsapp === true)[0];
  const facebook = props.contact.externals.items.filter(
    (external) => external.fields.tipo.fields.valor === 'facebook'
  )[0];
  function cutFacebook(facebook: string) {
    return `fb.com/${facebook.split('/').pop()}`;
  }

  return (
    <Box marginBottom="0" as="aside" w="100%" bg="yellow.50" textAlign="left" color="black">
      <Container maxW="container.xl">
        <Flex alignItems="center" direction={['column', null, 'row']}>
          <Text pt={['3px', null, 'auto']} as="strong">
            Dra. Graciela Pintos
          </Text>
          <Spacer></Spacer>
          <Stack spacing={[0, null, 15]} direction={['column', null, 'row']}>
            <Button
              as="a"
              href={`https://wa.me/${whatsapp.fields.numero}`}
              target="_blank"
              pt={['3px', null, 'auto']}
              h={['auto', null, 10]}
              colorScheme="whatsapp"
              leftIcon={<FaWhatsapp />}
              variant="ghost"
            >
              {whatsapp.fields.numero}
            </Button>
            <Button
              as="a"
              href={facebook.fields.enlace}
              target="_blank"
              py={['3px', null, 'auto']}
              h={['auto', null, 10]}
              colorScheme="facebook"
              leftIcon={<FaFacebook />}
              variant="ghost"
            >
              {cutFacebook(facebook.fields.enlace)}
            </Button>
          </Stack>
        </Flex>
      </Container>
    </Box>
  );
};

export default TopBox;
