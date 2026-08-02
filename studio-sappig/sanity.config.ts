import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {internationalizedArray} from 'sanity-plugin-internationalized-array'

import {schemaTypes} from './schemaTypes'
import {structure} from './structure'

export default defineConfig({
  name: 'default',
  title: 'SAPPIG.',

  projectId: '2560h915',
  dataset: 'production',

  plugins: [
    structureTool({structure}),
    visionTool(),
    /* Field-level localization. Dutch and English are always on screen, so
       filling both is the obvious default. French is one click away per field
       and, like anything left blank, falls back to Dutch on the site. */
    internationalizedArray({
      languages: [
        {id: 'nl', title: 'Nederlands'},
        {id: 'en', title: 'English'},
        {id: 'fr', title: 'Français'},
      ],
      defaultLanguages: ['nl', 'en'],
      fieldTypes: ['string', 'text'],
      buttonAddAll: false,
    }),
  ],

  schema: {
    types: schemaTypes,
    /* Singletons are created from Structure, never from "New document". */
    templates: (prev) =>
      prev.filter((t) => t.schemaType !== 'siteSettings' && t.schemaType !== 'homePage'),
  },

  document: {
    actions: (prev, {schemaType}) =>
      schemaType === 'siteSettings' || schemaType === 'homePage'
        ? prev.filter(({action}) => action !== 'duplicate' && action !== 'delete' && action !== 'unpublish')
        : prev,
  },
})
