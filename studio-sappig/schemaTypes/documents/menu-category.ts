import {defineType, defineField, defineArrayMember} from 'sanity'
import {UlistIcon} from '@sanity/icons/Ulist'
import {nlValue} from '../objects/menu-item'
import {EmojiInput} from '../../components/EmojiInput'

export const menuCategory = defineType({
  name: 'menuCategory',
  title: 'Menucategorie',
  type: 'document',
  icon: UlistIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Titel',
      type: 'internationalizedArrayString',
      description: 'Bv. "Smoothies", "Warme dranken", "Lunch".',
      validation: (rule) =>
        rule.custom((value) => (nlValue(value) ? true : 'Een Nederlandse titel is verplicht')),
    }),
    defineField({
      name: 'subtitle',
      title: 'Ondertitel',
      type: 'internationalizedArrayString',
      description: 'Het kleine labeltje naast de titel, bv. "100% fruit". Optioneel.',
    }),
    defineField({
      name: 'emoji',
      title: 'Emoji',
      type: 'string',
      description: 'Verschijnt rechts van de titel.',
      components: {input: EmojiInput},
      validation: (rule) => rule.max(8),
    }),
    defineField({
      name: 'note',
      title: 'Prijsregel',
      type: 'internationalizedArrayString',
      description: 'Staat vetgedrukt onder de titel, bv. "400 ml € 7,00 · 500 ml € 8,20".',
    }),
    defineField({
      name: 'extra',
      title: 'Extra regel',
      type: 'internationalizedArrayText',
      description: 'Cursieve regel onderaan de categorie, bv. "Extra shot gember + € 0,70".',
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      description:
        'Sleep om te herschikken. Gebruik "Add item" om iets toe te voegen en het prullenbakje om iets te verwijderen.',
      of: [defineArrayMember({type: 'menuItem'})],
    }),
    defineField({
      name: 'order',
      title: 'Volgorde',
      type: 'number',
      description: 'Lager = hoger op de kaart. De twee kolommen worden automatisch verdeeld.',
      initialValue: 100,
      validation: (rule) => rule.required().integer().min(0),
    }),
    defineField({
      name: 'status',
      title: 'Zichtbaarheid',
      type: 'string',
      options: {
        list: [
          {title: 'Op de kaart', value: 'visible'},
          {title: 'Verborgen', value: 'hidden'},
        ],
        layout: 'radio',
      },
      initialValue: 'visible',
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [
    {
      title: 'Volgorde op de kaart',
      name: 'menuOrder',
      by: [{field: 'order', direction: 'asc'}],
    },
  ],
  preview: {
    select: {title: 'title', emoji: 'emoji', items: 'items', order: 'order', status: 'status'},
    prepare({title, emoji, items, order, status}) {
      const count = Array.isArray(items) ? items.length : 0
      return {
        title: `${emoji ? emoji + ' ' : ''}${nlValue(title) || 'Naamloze categorie'}`,
        subtitle:
          `#${order ?? '?'} · ${count} item${count === 1 ? '' : 's'}` +
          (status === 'hidden' ? ' · verborgen' : ''),
      }
    },
  },
})
