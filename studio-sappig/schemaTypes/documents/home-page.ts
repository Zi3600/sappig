import {defineType, defineField, defineArrayMember} from 'sanity'
import {ImagesIcon} from '@sanity/icons/Images'

const altField = defineField({
  name: 'alt',
  title: 'Wat staat er op de foto?',
  type: 'string',
  description:
    'Korte beschrijving voor blinde en slechtziende bezoekers, en voor Google. Bv. "Drie kleurrijke smoothies voor de bloemenmuur".',
})

export const homePage = defineType({
  name: 'homePage',
  title: "Foto's homepagina",
  type: 'document',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'gallery',
      title: 'Fotostrip',
      type: 'array',
      description:
        'De foto\'s die je op de homepagina opzij kan scrollen. Sleep om te herschikken, het prullenbakje verwijdert. Laat leeg om de standaardfoto\'s van de site te tonen.',
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [altField],
          preview: {select: {media: 'asset', title: 'alt'}},
        }),
      ],
    }),
    defineField({
      name: 'panorama',
      title: 'Brede foto',
      type: 'image',
      description: 'De brede band onderaan, over de volledige breedte van het scherm.',
      options: {hotspot: true},
      fields: [altField],
    }),
    defineField({
      name: 'hoursImage',
      title: 'Achtergrond bij de openingsuren',
      type: 'image',
      description:
        'Staat als achtergrond achter de openingsuren. Kies een rustige foto — er komt tekst overheen.',
      options: {hotspot: true},
    }),
  ],
  preview: {
    select: {media: 'panorama'},
    prepare: ({media}) => ({title: "Foto's homepagina", media}),
  },
})
