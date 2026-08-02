import {defineType, defineField, defineArrayMember} from 'sanity'
import {BellIcon} from '@sanity/icons/Bell'
import {nlValue} from '../objects/menu-item'

export const popup = defineType({
  name: 'popup',
  title: 'Pop-upbericht',
  type: 'document',
  icon: BellIcon,
  groups: [
    {name: 'content', title: 'Bericht', default: true},
    {name: 'behaviour', title: 'Wanneer tonen'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Titel',
      type: 'internationalizedArrayString',
      group: 'content',
      validation: (rule) =>
        rule.custom((value) => (nlValue(value) ? true : 'Een Nederlandse titel is verplicht')),
    }),
    defineField({
      name: 'message',
      title: 'Bericht',
      type: 'internationalizedArrayText',
      group: 'content',
      validation: (rule) =>
        rule.custom((value) => (nlValue(value) ? true : 'Een Nederlands bericht is verplicht')),
    }),
    defineField({
      name: 'image',
      title: 'Afbeelding',
      type: 'image',
      group: 'content',
      options: {hotspot: true},
      description: 'Optioneel. Verschijnt bovenaan het bericht.',
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Knoptekst',
      type: 'internationalizedArrayString',
      group: 'content',
      description: 'Optioneel, bv. "Bekijk het menu". Laat leeg voor een bericht zonder knop.',
    }),
    defineField({
      name: 'ctaUrl',
      title: 'Knoplink',
      type: 'url',
      group: 'content',
      validation: (rule) => rule.uri({scheme: ['http', 'https', 'mailto', 'tel']}),
      hidden: ({parent}) => !nlValue(parent?.ctaLabel),
    }),
    defineField({
      name: 'tone',
      title: 'Toon',
      type: 'string',
      group: 'content',
      options: {
        list: [
          {title: 'Info — neutraal', value: 'info'},
          {title: 'Belangrijk — vraagt aandacht', value: 'alert'},
          {title: 'Feest — leuk nieuws', value: 'celebration'},
        ],
        layout: 'radio',
      },
      initialValue: 'info',
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      group: 'behaviour',
      description: 'Alleen berichten op "Live" worden op de site getoond.',
      options: {
        list: [
          {title: 'Concept — niet zichtbaar', value: 'draft'},
          {title: 'Live — zichtbaar op de site', value: 'live'},
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'trigger',
      title: 'Wanneer verschijnt het?',
      type: 'string',
      group: 'behaviour',
      options: {
        list: [
          {title: 'Bij de eerste klik op de site', value: 'click'},
          {title: 'Meteen bij het openen van de pagina', value: 'load'},
          {title: 'Na een aantal seconden', value: 'delay'},
        ],
        layout: 'radio',
      },
      initialValue: 'click',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'delaySeconds',
      title: 'Aantal seconden',
      type: 'number',
      group: 'behaviour',
      initialValue: 5,
      hidden: ({parent}) => parent?.trigger !== 'delay',
      validation: (rule) => rule.min(0).max(120),
    }),
    defineField({
      name: 'frequency',
      title: 'Hoe vaak per bezoeker?',
      type: 'string',
      group: 'behaviour',
      options: {
        list: [
          {title: 'Eén keer per bezoek', value: 'session'},
          {title: 'Eén keer, daarna nooit meer', value: 'once'},
          {title: 'Elke keer opnieuw', value: 'always'},
        ],
        layout: 'radio',
      },
      initialValue: 'session',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'showOn',
      title: "Op welke pagina's?",
      type: 'array',
      group: 'behaviour',
      of: [defineArrayMember({type: 'string'})],
      options: {
        list: [
          {title: 'Home', value: 'home'},
          {title: 'Menu', value: 'menu'},
          {title: 'Juridische info', value: 'legal'},
        ],
        layout: 'grid',
      },
      initialValue: ['home', 'menu'],
      validation: (rule) => rule.min(1).error('Kies minstens één pagina'),
    }),
    defineField({
      name: 'startDate',
      title: 'Tonen vanaf',
      type: 'datetime',
      group: 'behaviour',
      description: 'Optioneel. Laat leeg om meteen te starten.',
    }),
    defineField({
      name: 'endDate',
      title: 'Tonen tot',
      type: 'datetime',
      group: 'behaviour',
      description: 'Optioneel. Laat leeg om het bericht te tonen tot je het op "Concept" zet.',
      validation: (rule) =>
        rule.custom((endDate, context) => {
          const startDate = (context.document as {startDate?: string} | undefined)?.startDate
          if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
            return 'De einddatum moet na de startdatum liggen'
          }
          return true
        }),
    }),
  ],
  preview: {
    select: {title: 'title', status: 'status', tone: 'tone', endDate: 'endDate'},
    prepare({title, status, tone, endDate}) {
      const expired = endDate && new Date(endDate) < new Date()
      const state = status === 'live' ? (expired ? 'verlopen' : 'live') : 'concept'
      return {
        title: nlValue(title) || 'Naamloos bericht',
        subtitle: `${state} · ${tone ?? 'info'}`,
      }
    },
  },
})
