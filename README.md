# SAPPIG.

Website voor SAPPIG., de 100% plantaardige juicebar in hartje Hasselt.

Statische site (HTML/CSS/JS, geen build) op GitHub Pages, met Sanity als CMS
voor het menu en de pop-upberichten.

```
.                     de site zelf — dit is wat GitHub Pages publiceert
├── index.html
├── menu.html
├── legal.html
├── styles.css
├── i18n.js           NL/EN/FR vertalingen van de vaste teksten
├── script.js         navigatie, carrousels, scroll-reveal
├── sanity.js         haalt menu + pop-ups op uit Sanity
└── studio-sappig/    Sanity Studio (aparte app, wordt niet meegepubliceerd)
```

## Het menu aanpassen

Alles gebeurt in de Studio — er hoeft niets aan de code te veranderen.

```bash
cd studio-sappig
npm run dev
```

Open http://localhost:3333.

- **Menu → Menucategorieën** — categorieën met hun items. Binnen een categorie
  sleep je items om de volgorde te wijzigen, `Add item` voegt toe, het
  prullenbakje verwijdert. Een item kan ook op *Uitverkocht* (blijft zichtbaar,
  doorstreept) of *Verborgen* (tijdelijk van de kaart).
- **Pop-upberichten** — belangrijke mededelingen. Zet op *Live* om te tonen.
- **Site-instellingen** — de notitie onderaan het menu en de taalmelding.

Wijzigingen zijn zichtbaar op de site zodra je op **Publish** klikt.

### Talen

Nederlands is de basis. Engels en Frans zijn per veld optioneel: laat je ze
leeg, dan toont de site het Nederlands. Daarom staat op de menupagina de
melding dat het menu standaard in het Nederlands wordt bijgewerkt.

## Studio online zetten

Zodat je hem overal kan gebruiken, zonder `npm run dev`:

```bash
cd studio-sappig
npx sanity deploy
```

## Belangrijk: CORS

De site haalt content op vanuit de browser. Elke URL waar de site draait moet
in Sanity toegelaten zijn:

```bash
cd studio-sappig
npx sanity cors add https://zi3600.github.io
npx sanity cors add http://localhost:4173
```

Zonder dit valt de site terug op het menu dat vast in `menu.html` staat — de
site blijft dus altijd werken, maar toont dan niet je laatste wijzigingen.

## Vangnet

`menu.html` bevat het volledige menu ook gewoon als HTML. Als Sanity onbereikbaar
is of JavaScript uit staat, ziet de bezoeker dat. Handig, maar het betekent wel
dat die HTML na verloop van tijd veroudert.
