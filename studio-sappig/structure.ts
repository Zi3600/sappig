import type {StructureResolver} from 'sanity/structure'
/* @sanity/icons v5 ships one module per icon; the barrel no longer re-exports them */
import {UlistIcon} from '@sanity/icons/Ulist'
import {ImagesIcon} from '@sanity/icons/Images'
import {BellIcon} from '@sanity/icons/Bell'
import {CogIcon} from '@sanity/icons/Cog'

/* homePage and siteSettings are singletons: one fixed document each, so they
   open straight into the editor instead of a list with a "create new" button. */
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
        .title("Foto's homepagina")
        .icon(ImagesIcon)
        .child(S.document().schemaType('homePage').documentId('homePage')),
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
