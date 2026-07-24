import {defineType, defineField, defineArrayMember} from 'sanity'

/** Pull the Dutch value out of an internationalized array for Studio previews. */
export function nlValue(field: unknown): string {
  if (!Array.isArray(field)) return ''
  const entries = field as Array<{_key?: string; value?: string}>
  const nl = entries.find((e) => e._key === 'nl')
  return (nl?.value || entries.find((e) => e.value)?.value || '').trim()
}

export const menuItem = defineType({
  name: 'menuItem',
  title: 'Menu-item',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Naam',
      type: 'internationalizedArrayString',
      description:
        'Vul Nederlands in. Engels en Frans zijn optioneel — laat je ze leeg, dan tonen we het Nederlands.',
      validation: (rule) =>
        rule.custom((value) => (nlValue(value) ? true : 'Een Nederlandse naam is verplicht')),
    }),
    defineField({
      name: 'description',
      title: 'Omschrijving',
      type: 'internationalizedArrayText',
      description: 'De ingrediënten, bv. "aardbei, banaan, mango, appelsap".',
    }),
    defineField({
      name: 'price',
      title: 'Prijs',
      type: 'string',
      description:
        'Bv. "€ 7,00". Laat leeg als de prijs al bovenaan de categorie staat (bv. bij smoothies).',
    }),
    defineField({
      name: 'badges',
      title: 'Labels',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      options: {
        list: [
          {title: '🌶️ Pittig', value: 'spicy'},
          {title: 'Nieuw', value: 'new'},
          {title: 'Favoriet', value: 'favourite'},
        ],
        layout: 'grid',
      },
    }),
    defineField({
      name: 'status',
      title: 'Beschikbaarheid',
      type: 'string',
      options: {
        list: [
          {title: 'Op de kaart', value: 'visible'},
          {title: 'Uitverkocht (blijft zichtbaar, doorstreept)', value: 'soldOut'},
          {title: 'Verborgen (tijdelijk van de kaart)', value: 'hidden'},
        ],
        layout: 'radio',
      },
      initialValue: 'visible',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {name: 'name', price: 'price', status: 'status', description: 'description'},
    prepare({name, price, status, description}) {
      const label = status === 'soldOut' ? ' · uitverkocht' : status === 'hidden' ? ' · verborgen' : ''
      return {
        title: nlValue(name) || 'Naamloos item',
        subtitle: [price, nlValue(description)].filter(Boolean).join(' — ') + label,
      }
    },
  },
})
