import { HStack, Icon, Link, Text, Flex } from '@chakra-ui/react';
import React, { ReactElement } from 'react';
import NextLink from 'next/link';
import {
  FaPhoneSquareAlt as PhoneIcon,
  FaWhatsappSquare as WhatsappIcon,
  FaMap as MapIcon,
  FaTwitterSquare as TwitterIcon,
  FaFacebookSquare as FacebookIcon,
  FaLinkedin as LinkedinIcon,
  FaExternalLinkSquareAlt as ExternalIcon,
} from 'react-icons/fa';

export function LinkedRow(props: {
  type: 'whatsapp' | 'phone' | 'address' | 'facebook' | 'twitter' | 'linkedin' | 'external';
  children: ReactElement | ReactElement[] | string;
  label: string;
  iconSize?: string;
  url?: string;
}) {
  let CurrentIcon, url;
  const { iconSize = '1.8em' } = props;
  switch (props.type) {
    case 'whatsapp':
      CurrentIcon = <Icon fontSize={iconSize} as={WhatsappIcon} color="green.400" />;
      url = `https://wa.me/${props.children}`;
      break;
    case 'address':
      CurrentIcon = <Icon fontSize={iconSize} as={MapIcon} color="white.200" />;
      break;
    case 'phone':
      CurrentIcon = <Icon fontSize={iconSize} as={PhoneIcon} color="yellow.200" />;
      url = `tel:${props.children}`;
      break;
    case 'facebook':
      CurrentIcon = <Icon fontSize={iconSize} as={FacebookIcon} {...props} color="blue.300" />;
      break;
    case 'linkedin':
      CurrentIcon = <Icon fontSize={iconSize} as={LinkedinIcon} {...props} color="blue.300" />;
      break;
    case 'twitter':
      CurrentIcon = <Icon fontSize={iconSize} as={TwitterIcon} {...props} color="blue.300" />;
      break;
    default:
    case 'external':
      CurrentIcon = <Icon fontSize={iconSize} as={ExternalIcon} {...props} color="red.100" />;
      break;
  }
  url = props.url ?? url ?? '';
  return (
    <NextLink href={url} passHref>
      <Link target="_blank" w="100%">
        <Flex
          direction={['column-reverse', 'row-reverse', 'row']}
          w={['100%', null, '100%']}
          alignItems={['left', null, 'center']}
          justifyContent="left"
        >
          <Text
            mx={[0, 5]}
            w={['auto', null, '100%']}
            textAlign={['left', null, 'right']}
            wordBreak="break-word"
          >
            <Text as="strong">{props.label}: </Text>
            {props.children}
          </Text>
          {CurrentIcon}
        </Flex>
      </Link>
    </NextLink>
  );
}
