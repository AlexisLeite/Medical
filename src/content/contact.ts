import { EntryCollection } from 'contentful';

export interface Phone {
  nombre: string;
  numero: string;
  whatsapp?: boolean;
}

export interface Location {
  nombre: string;
  direccion: string;
  map: string;
  url: string;
}

export interface ExternalLink {
  nombre: string;
  enlace: string;
  tipo: any;
}

export interface ContactInformation {
  phones: EntryCollection<Phone>;
  addresses: EntryCollection<Location>;
  externals: EntryCollection<ExternalLink>;
}
