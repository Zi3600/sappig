/* Generates seed.ndjson — the menu that currently lives in menu.html, plus the
   EN/FR translations from i18n.js, as Sanity documents.
   Run once so the owner opens a Studio with the real menu already in it:

     node scripts/build-seed.mjs
     npx sanity dataset import seed.ndjson production

   Explicit _id values are used here (against the usual "let Sanity generate
   IDs" rule) purely so a re-import updates the same documents instead of
   duplicating the whole menu. */

import {writeFileSync} from 'node:fs'
import {fileURLToPath} from 'node:url'
import {dirname, join} from 'node:path'

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'seed.ndjson')

/* --- helpers to build internationalized-array values --- */
const intl = (kind) => (nl, en, fr) =>
  [
    ['nl', nl],
    ['en', en],
    ['fr', fr],
  ]
    .filter(([, value]) => value)
    .map(([_key, value]) => ({_key, _type: `internationalizedArray${kind}Value`, value}))

const str = intl('String')
const txt = intl('Text')

let keySeed = 0
const key = () => `k${(keySeed++).toString(36)}${Math.random().toString(36).slice(2, 7)}`

const item = (name, opts = {}) => ({
  _key: key(),
  _type: 'menuItem',
  name: Array.isArray(name) ? name : str(name),
  status: 'visible',
  ...(opts.price ? {price: opts.price} : {}),
  ...(opts.desc ? {description: opts.desc} : {}),
  ...(opts.badges ? {badges: opts.badges} : {}),
})

/* descriptions reused across several items */
const oat = txt('met haverdrank', 'with oat drink', 'avec boisson avoine')
const mustard = txt(
  'met salade en mosterddressing',
  'with salad and mustard dressing',
  'avec salade et vinaigrette à la moutarde',
)
const duchesse = txt(
  'met pommes duchesse en salade',
  'with pommes duchesse and salad',
  'avec pommes duchesse et salade',
)

const categories = [
  {
    id: 'smoothies',
    title: str('Smoothies', 'Smoothies', 'Smoothies'),
    subtitle: str('100% fruit', '100% fruit', '100 % fruits'),
    emoji: '🥤',
    note: str('400 ml € 7,00 · 500 ml € 8,20'),
    order: 10,
    items: [
      item('Strawberry Fields', {desc: txt('aardbei, banaan, mango, appelsap', 'strawberry, banana, mango, apple juice', 'fraise, banane, mangue, jus de pomme')}),
      item('Orange Strawberry', {desc: txt('aardbei, banaan, mango, sinaasappelsap', 'strawberry, banana, mango, orange juice', 'fraise, banane, mangue, jus d’orange')}),
      item('Framboezel', {desc: txt('framboos, mango, appelsap', 'raspberry, mango, apple juice', 'framboise, mangue, jus de pomme')}),
      item('Purple Disco', {desc: txt('bosvruchten, mango, appelsap', 'forest fruits, mango, apple juice', 'fruits des bois, mangue, jus de pomme')}),
      item('Pineapple Express', {desc: txt('ananas, mango, appelsap', 'pineapple, mango, apple juice', 'ananas, mangue, jus de pomme')}),
      item('Tropic Thunder', {desc: txt('ananas, banaan, passievrucht, sinaasappelsap', 'pineapple, banana, passion fruit, orange juice', 'ananas, banane, fruit de la passion, jus d’orange')}),
    ],
  },
  {
    id: 'sapjes',
    title: str('Sapjes', 'Juices', 'Jus'),
    subtitle: str('100% fruit & groenten', '100% fruit & veg', '100 % fruits & légumes'),
    emoji: '🍹',
    note: str('400 ml € 7,00 · 500 ml € 8,20'),
    extra: txt('Extra shot gember + € 0,70', 'Extra ginger shot + € 0,70', 'Shot de gingembre en plus + 0,70 €'),
    order: 20,
    items: [
      item('The Green Velvet', {desc: txt('selder, komkommer, limoensap, appelsap', 'celery, cucumber, lime juice, apple juice', 'céleri, concombre, jus de citron vert, jus de pomme')}),
      item('A Clockwork Orange', {desc: txt('wortel, gember, sinaasappelsap', 'carrot, ginger, orange juice', 'carotte, gingembre, jus d’orange')}),
      item('The Hangover', {desc: txt('spinazie, banaan, mango, appelsap', 'spinach, banana, mango, apple juice', 'épinards, banane, mangue, jus de pomme')}),
      item('True Blood', {badges: ['spicy'], desc: txt('selder, limoensap, tabasco, tomatensap', 'celery, lime juice, tabasco, tomato juice', 'céleri, jus de citron vert, tabasco, jus de tomate')}),
      item('Mr Cocomint', {desc: txt('ananas, mango, munt, kokosdrank', 'pineapple, mango, mint, coconut drink', 'ananas, mangue, menthe, boisson coco')}),
    ],
  },
  {
    id: 'shakes',
    title: str('Shakes', 'Shakes', 'Shakes'),
    emoji: '🥛',
    note: str('400 ml € 6,80 · 500 ml € 8,00'),
    order: 30,
    items: [
      item('Pink Shake', {desc: txt('aardbei, banaan, vanilledrank', 'strawberry, banana, vanilla drink', 'fraise, banane, boisson vanille')}),
      item('Dark Shake', {desc: txt('banaan, chocodrank', 'banana, choco drink', 'banane, boisson choco')}),
      item('Banana Shake', {desc: txt('banaan, bananendrank', 'banana, banana drink', 'banane, boisson banane')}),
    ],
  },
  {
    id: 'protein',
    title: str('Protein Shakes', 'Protein Shakes', 'Shakes protéinés'),
    emoji: '💪',
    note: str('400 ml € 9,00'),
    order: 40,
    items: [
      item('Coffeenator', {desc: txt('Fyve koffie-proteïnepoeder, banaan, haverdrank', 'Fyve coffee protein powder, banana, oat drink', 'poudre protéinée café Fyve, banane, boisson avoine')}),
      item('Tropical Matcha', {desc: txt('Fyve matcha-proteïnepoeder, mango, ananas, kokosdrank', 'Fyve matcha protein powder, mango, pineapple, coconut drink', 'poudre protéinée matcha Fyve, mangue, ananas, boisson coco')}),
    ],
  },
  {
    id: 'bubbletea',
    title: str('Bubble Tea', 'Bubble Tea', 'Bubble Tea'),
    emoji: '🧋',
    note: str('400 ml € 6,80'),
    order: 50,
    items: [
      item(str('Perzik zwarte thee', 'Peach black tea', 'Thé noir pêche'), {desc: txt('met mango-bubbels', 'with mango bubbles', 'aux billes de mangue')}),
      item(str('Bosvruchten zwarte thee', 'Forest fruit black tea', 'Thé noir fruits des bois'), {desc: txt('met aardbei-bubbels', 'with strawberry bubbles', 'aux billes de fraise')}),
    ],
  },
  {
    id: 'icedlattes',
    title: str('Blended Iced Lattes', 'Blended Iced Lattes', 'Blended Iced Lattes'),
    emoji: '🧊',
    note: str('400 ml'),
    extra: txt(
      'Shot siroop (karamel / kaneel / speculoos / vanille / aardbei / mango / kokosdrank i.p.v. haverdrank) + € 0,50',
      'Syrup shot (caramel / cinnamon / speculoos / vanilla / strawberry / mango / coconut drink instead of oat drink) + € 0,50',
      'Shot de sirop (caramel / cannelle / spéculoos / vanille / fraise / mangue / boisson coco au lieu de la boisson avoine) + 0,50 €',
    ),
    order: 60,
    items: [
      item('Matcha / Chai / Golden Latte', {price: '€ 6,80', desc: oat}),
      item('Latte Macchiato', {price: '€ 5,50', desc: oat}),
    ],
  },
  {
    id: 'warm',
    title: str('Warme dranken', 'Hot drinks', 'Boissons chaudes'),
    emoji: '☕',
    order: 70,
    items: [
      item(str('Koffie / Deca / Espresso', 'Coffee / Decaf / Espresso', 'Café / Déca / Espresso'), {price: '€ 3,20'}),
      item('Cappuccino', {price: '€ 4,00', desc: oat}),
      item('Latte Macchiato', {price: '€ 4,20', desc: oat}),
      item('Matcha / Chai / Golden Latte', {price: '€ 5,00'}),
      item(str('Losse thee', 'Loose leaf tea', 'Thé en vrac'), {price: '€ 4,00', desc: txt('rood / geel / groen / zwart', 'red / yellow / green / black', 'rouge / jaune / vert / noir')}),
      item(str('Verse munt- of gemberthee', 'Fresh mint or ginger tea', 'Thé frais menthe ou gingembre'), {price: '€ 4,50'}),
    ],
  },
  {
    id: 'lunch',
    title: str('Lunch', 'Lunch', 'Lunch'),
    emoji: '🍽️',
    order: 80,
    items: [
      item(str('Soep van de dag', 'Soup of the day', 'Soupe du jour'), {price: '€ 8,50', desc: txt('met appel en brood', 'with apple and bread', 'avec pomme et pain')}),
      item(str('Brood wit / bruin', 'Bread white / brown', 'Pain blanc / brun'), {
        price: '€ 12,50',
        desc: txt(
          'met groentjes en beleg — keuze uit ‘mortadella en kaas’, ‘eiersalade’, ‘filet americain’, gerookte ‘zalm’ met zure room, of tonino',
          'with veggies and topping — choice of ‘mortadella and cheese’, ‘egg salad’, ‘filet americain’, smoked ‘salmon’ with sour cream, or tonino',
          'avec légumes et garniture — au choix : « mortadella et fromage », « salade d’œufs », « filet americain », « saumon » fumé à la crème aigre, ou tonino',
        ),
      }),
      item('Hot(not)Dog', {price: '€ 10,00'}),
      item(str('Quiche van de dag', 'Quiche of the day', 'Quiche du jour'), {price: '€ 13,00', desc: mustard}),
      item('Scrambled tofu', {price: '€ 15,00', desc: mustard}),
      item('Spaghetti volognese', {price: '€ 17,00'}),
      item('Lunch bowl', {price: '€ 17,00', desc: txt('met rijst, salade en tofu/tempeh', 'with rice, salad and tofu/tempeh', 'avec riz, salade et tofu/tempeh')}),
      item('Curry', {price: '€ 20,00', desc: txt('met rijst en salade', 'with rice and salad', 'avec riz et salade')}),
      item('Schnitzel', {price: '€ 18,00', desc: txt('met puree, salade en appelmoes', 'with mash, salad and apple sauce', 'avec purée, salade et compote de pommes')}),
      item('Vol-au-vegan', {price: '€ 22,00', desc: duchesse}),
      item('Stoofvlees', {price: '€ 22,00', desc: duchesse}),
    ],
  },
]

const docs = categories.map((cat) => ({
  _id: `menuCategory.${cat.id}`,
  _type: 'menuCategory',
  title: cat.title,
  ...(cat.subtitle ? {subtitle: cat.subtitle} : {}),
  ...(cat.emoji ? {emoji: cat.emoji} : {}),
  ...(cat.note ? {note: cat.note} : {}),
  ...(cat.extra ? {extra: cat.extra} : {}),
  items: cat.items,
  order: cat.order,
  status: 'visible',
}))

docs.push({
  _id: 'siteSettings',
  _type: 'siteSettings',
  menuNote: str(
    'Alles op onze kaart is 100% plantaardig.',
    'Everything on our menu is 100% plant-based.',
    'Tout sur notre carte est 100 % végétal.',
  ),
  instagramUrl: 'https://www.instagram.com/sappig.juicebar/',
})

writeFileSync(OUT, docs.map((d) => JSON.stringify(d)).join('\n') + '\n', 'utf8')

const itemCount = categories.reduce((n, c) => n + c.items.length, 0)
console.log(`seed.ndjson — ${categories.length} categories, ${itemCount} items, +1 settings doc`)
