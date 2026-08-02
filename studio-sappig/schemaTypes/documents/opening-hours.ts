import {defineType, defineField, defineArrayMember} from 'sanity'
import {ClockIcon} from '@sanity/icons/Clock'
import {nlValue} from '../objects/menu-item'

/* One row of the opening-hours table. Kept as free-text label + times rather
   than weekday checkboxes, because the real hours are things like
   "wo – vr" and "1e zondag van de maand", which a day-picker cannot express. */
const hoursRow = defineArrayMember({
  type: 'object',
  name: 'hoursRow',
  fields: [
    defineField({
      name: 'label',
      title: 'Dag(en)',
      type: 'internationalizedArrayString',
      description: 'Bv. "wo – vr", "zaterdag", "Koopzondag".',
      validation: (rule) =>
        rule.custom((value) => (nlValue(value) ? true : 'Vul minstens het Nederlands in')),
    }),
    defineField({
      name: 'note',
      title: 'Extra uitleg',
      type: 'internationalizedArrayString',
      description: 'Klein regeltje eronder, bv. "1e zondag van de maand". Optioneel.',
    }),
    defineField({
      name: 'times',
      title: 'Uren',
      type: 'string',
      description: 'Bv. "12:00 – 18:00". Laat leeg en vul hieronder "Gesloten" aan als je dicht bent.',
    }),
    defineField({
      name: 'days',
      title: 'Welke dagen? (voor Google)',
      type: 'array',
      description:
        'Alleen voor Google en Google Maps — dit verandert niets aan de site. Vink de dagen aan die deze rij dekt. Laat leeg bij onregelmatige rijen zoals "1e zondag van de maand": die kan Google toch niet verwerken.',
      of: [defineArrayMember({type: 'string'})],
      options: {
        list: [
          {title: 'Maandag', value: 'Monday'},
          {title: 'Dinsdag', value: 'Tuesday'},
          {title: 'Woensdag', value: 'Wednesday'},
          {title: 'Donderdag', value: 'Thursday'},
          {title: 'Vrijdag', value: 'Friday'},
          {title: 'Zaterdag', value: 'Saturday'},
          {title: 'Zondag', value: 'Sunday'},
        ],
        layout: 'grid',
      },
    }),
    defineField({
      name: 'highlight',
      title: 'Opvallend maken',
      type: 'string',
      description: 'Geeft de dag een gekleurd labeltje, voor uitzonderingen zoals koopzondag.',
      options: {
        list: [
          {title: 'Gewoon', value: 'none'},
          {title: 'Geel labeltje', value: 'sun'},
          {title: 'Roze labeltje', value: 'rose'},
        ],
        layout: 'radio',
      },
      initialValue: 'none',
    }),
  ],
  preview: {
    select: {label: 'label', times: 'times', note: 'note'},
    prepare: ({label, times, note}) => ({
      title: `${nlValue(label) || '—'}  ·  ${times || 'gesloten'}`,
      subtitle: nlValue(note),
    }),
  },
})

export const openingHours = defineType({
  name: 'openingHours',
  title: 'Openingsuren',
  type: 'document',
  icon: ClockIcon,
  fields: [
    defineField({
      name: 'rows',
      title: 'Uren',
      type: 'array',
      description:
        'Sleep om te herschikken. "Add item" voegt een rij toe, het prullenbakje verwijdert er een. Deze uren verschijnen op de homepagina én onderaan bij "Vind ons".',
      of: [hoursRow],
      validation: (rule) => rule.min(1).error('Voeg minstens één rij toe'),
    }),
    defineField({
      name: 'closedNote',
      title: 'Gesloten-regel',
      type: 'internationalizedArrayText',
      description: 'Cursieve regel onder de tabel, bv. "Gesloten op zondag, maandag en dinsdag."',
    }),
  ],
  preview: {
    select: {rows: 'rows'},
    prepare: ({rows}) => ({
      title: 'Openingsuren',
      subtitle: `${Array.isArray(rows) ? rows.length : 0} rij(en)`,
    }),
  },
})
