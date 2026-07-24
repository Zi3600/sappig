import type {StructureResolver} from 'sanity/structure'
import {CogIcon, UlistIcon, BellIcon} from '@sanity/icons'

/* siteSettings is a singleton: one fixed document, no list, no "create new". */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('SAPPIG.')
    .items([
      S.listItem()
        .title('Menu')
        .icon(UlistIcon)
        .child(
          S.documentTypeList('menuCategory')
            .title('Menucategorieën')
            .defaultOrdering([{field: 'order', direction: 'asc'}]),
        ),
      S.listItem()
        .title('Pop-upberichten')
        .icon(BellIcon)
        .child(S.documentTypeList('popup').title('Pop-upberichten')),
      S.divider(),
      S.listItem()
        .title('Site-instellingen')
        .icon(CogIcon)
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
    ])
