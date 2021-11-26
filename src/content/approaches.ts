import { client } from './client';
import { Document } from '@contentful/rich-text-types';
import { EntryCollection } from 'contentful';

export type Approach = {
  titulo: string;
  descripcion: Document;
  portada: {
    fields: {
      file: {
        url: string;
      };
    };
  };
};

let approaches: EntryCollection<Approach>;

async function fakePromise() {
  return;
}

export const Approaches = {
  get: {
    all: async () => {
      return await client.getEntries<Approach>({ content_type: 'enfoque' });
    },
    byId: async (id: string) => {
      return await client.getEntry<Approach>(id);
    },
    previewAll: async () => {
      return await client.getEntries<Approach>({
        content_type: 'enfoque',
        select: 'fields.titulo,sys.id',
        order: 'fields.order',
      });
    },
    query: async (query: { [key: string]: any }) =>
      await client.getEntries<Approach>(Object.assign({ content_type: 'enfoque' }, query)),
  },
};
