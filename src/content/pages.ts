import { client } from './client';
import { Document } from '@contentful/rich-text-types';
import { EntryCollection, Entry } from 'contentful';
import { Approach } from './approaches';
import Conf from './../util/conf';

export type PageInterface = {
  titulo: string;
  cuerpo: Document;
  enfoque: any;
};

export interface RelatedToProps<Type> {
  page: Entry<Type>;
  skipRelated?: number;
  skipPartners?: number;
  limitRelated?: number;
  limitPartners?: number;
}

export const Pages = {
  get: {
    all: async () => {
      return await client.getEntries<PageInterface>({
        content_type: 'pagina',
        'fields.enfoque.sys.contentType.sys.id': 'enfoque',
      });
    },
    byId: async (id: string) => {
      return await client.getEntry<PageInterface>(id);
    },
    previewAll: async () => {
      return await client.getEntries<PageInterface>({
        content_type: 'pagina',
        'fields.enfoque.sys.contentType.sys.id': 'enfoque',
        select: 'fields.titulo,sys.id',
      });
    },
    relatedToFocus: async (props: RelatedToProps<Approach>) => {
      const partners =
        (typeof props.limitPartners === 'undefined' || props.limitPartners > 0) &&
        (await Pages.get.query({
          content_type: 'pagina',
          'fields.enfoque.sys.contentType.sys.id': 'enfoque',
          'fields.enfoque.fields.titulo': props.page.fields.titulo,
          limit: props.limitPartners || Conf.pages.partners,
          skip: props.skipPartners || 0,
        }));
      const related =
        (typeof props.limitRelated === 'undefined' || props.limitRelated > 0) &&
        (await Pages.get.query({
          content_type: 'pagina',
          'fields.enfoque.sys.contentType.sys.id': 'enfoque',
          'fields.enfoque.fields.titulo[ne]': props.page.fields.titulo,
          limit: props.limitRelated || Conf.pages.related,
          skip: props.skipRelated || 0,
        }));
      return { partners, related };
    },
    relatedToPage: async (props: RelatedToProps<PageInterface>) => {
      const partners =
        (typeof props.limitPartners === 'undefined' || props.limitPartners > 0) &&
        (await Pages.get.query({
          'fields.enfoque.fields.titulo': props.page.fields.enfoque.fields.titulo,
          'fields.titulo[ne]': props.page.fields.titulo,
          limit: props.limitPartners || Conf.pages.partners,
          skip: props.skipPartners || 0,
        }));
      const related =
        (typeof props.limitRelated === 'undefined' || props.limitRelated > 0) &&
        (await Pages.get.query({
          'fields.enfoque.fields.titulo[ne]': props.page.fields.enfoque.fields.titulo,
          'fields.titulo[ne]': props.page.fields.titulo,
          limit: props.limitRelated || Conf.pages.related,
          skip: props.skipRelated,
        }));
      return { partners, related };
    },
    query: async (query: { [key: string]: any }) =>
      await client.getEntries<PageInterface>(
        Object.assign(
          {
            content_type: 'pagina',
            'fields.enfoque.sys.contentType.sys.id': 'enfoque',
            limit: Conf.pages.query,
          },
          query
        )
      ),
    skip: async (query: { [key: string]: any }, skip: number) =>
      Pages.get.query(Object.assign(query, { skip })),
  },
};
