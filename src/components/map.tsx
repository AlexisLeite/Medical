import { Container, AspectRatio, Box } from '@chakra-ui/react';
import * as React from 'react';

interface MapProps {
  map: string;
}

const Map: React.FunctionComponent<MapProps> = ({ map }) => {
  const [id, setId] = React.useState<string>();
  React.useEffect(() => {
    setId(`Map-${Date.now()}`);
  }, []);
  React.useEffect(() => {
    const resize = () => {
      if (id !== undefined) {
        const map = document.querySelector(`#${id} iframe`) as HTMLElement;

        map.style.width = '100%';
        map.style.height = '100%';
      }
    };
    setTimeout(resize, 200);

    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [id]);
  return (
    <AspectRatio mb={10} ration={1} id="Map">
      <Box id={id} dangerouslySetInnerHTML={{ __html: map }} w="100%" h="100%"></Box>
    </AspectRatio>
  );
};

export default Map;
