import { Approaches } from '../content/approaches';
import { client } from './../content/client';
import { LayoutProps } from '../components/layout';
import { FooterDescription } from '../components/footer';
import { Location, Phone, ExternalLink } from './../content/contact';

export async function getLayoutProps(): Promise<LayoutProps> {
  const approaches = await Approaches.get.query({ order: 'fields.order' });
  const profile = await client.getAssets({ 'fields.title': 'Perfil Pie de Página' });
  const description = await client.getEntry<FooterDescription>('X0HorBuiX8yCPyHYnc65c');
  const addresses = await client.getEntries<Location>({ content_type: 'direccion' });
  const phones = await client.getEntries<Phone>({ content_type: 'telefono' });
  const externals = await client.getEntries<ExternalLink>({ content_type: 'redesSociales' });
  const contact = { addresses, phones, externals };
  return {
    approaches,
    profile: profile.items[0],
    description,
    contact,
  };
}
