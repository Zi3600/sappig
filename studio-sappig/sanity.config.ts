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
    /* Field-level localization. Dutch is the only language shown by default —
       the owner adds EN/FR per field only when a translation is actually
       wanted, and the site falls back to Dutch everywhere else. */
    internationalizedArray({
      languages: [
        {id: 'nl', title: 'Nederlands'},
        {id: 'en', title: 'English'},
        {id: 'fr', title: 'Français'},
      ],
      defaultLanguages: ['nl'],
      fieldTypes: ['string', 'text'],
      buttonAddAll: false,
    }),
  ],

  schema: {
    types: schemaTypes,
    /* The singleton is created once from Structure, never from "New document". */
    templates: (prev) => prev.filter((t) => t.schemaType !== 'siteSettings'),
  },

  document: {
    actions: (prev, {schemaType}) =>
      schemaType === 'siteSettings'
        ? prev.filter(({action}) => action !== 'duplicate' && action !== 'delete' && action !== 'unpublish')
        : prev,
  },
})
