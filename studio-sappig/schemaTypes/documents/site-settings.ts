import {defineType, defineField} from 'sanity'
import {CogIcon} from '@sanity/icons'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site-instellingen',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'menuNote',
      title: 'Notitie onderaan het menu',
      type: 'internationalizedArrayString',
      description: 'Standaard: "Alles op onze kaart is 100% plantaardig."',
    }),
    defineField({
      name: 'languageNotice',
      title: 'Taalmelding op de menupagina',
      type: 'internationalizedArrayText',
      description:
        'Legt uit dat het menu standaard in het Nederlands wordt bijgewerkt. Laat leeg om de standaardtekst van de site te gebruiken.',
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Instagram-link',
      type: 'url',
      initialValue: 'https://www.instagram.com/sappig.juicebar/',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
  ],
  preview: {
    prepare: () => ({title: 'Site-instellingen'}),
  },
})
