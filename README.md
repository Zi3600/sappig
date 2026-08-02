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

## Eenmalige setup (één keer, door de ontwikkelaar)

```bash
cd studio-sappig
npm install
npx sanity login                                  # 1. inloggen
npx sanity cors add https://zi3600.github.io      # 2. site mag content ophalen
npx sanity cors add http://localhost:4173         # 2b. idem voor lokaal testen
npx sanity schema deploy                          # 3. schema naar Sanity
npx sanity dataset import seed.ndjson production  # 4. huidig menu inladen
npx sanity deploy                                 # 5. Studio online zetten
```

Stap 2 is de belangrijkste: zonder CORS toont de live site het vaste menu uit
`menu.html` in plaats van wat er in Sanity staat.

Stap 4 vult Sanity met het menu zoals het nu op de site staat — 8 categorieën,
37 items, met Engelse en Franse vertalingen. De klant begint dus niet met een
lege kaart. Het bestand komt uit `scripts/build-seed.mjs`.

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
  Een **nieuwe sectie** maken — bv. een seizoenskaart of een specialekaart —
  doe je met de knop *Create* bovenaan: kies een titel, een emoji, en een
  volgorde-nummer dat bepaalt waar de sectie op de kaart komt.
- **Foto's homepagina** — de fotostrip, de brede foto en de achtergrondfoto bij
  de openingsuren. Sleep om te herschikken. Met het bolletje op de foto bepaal
  je welk deel zichtbaar blijft als de foto bijgesneden wordt.
- **Pop-upberichten** — belangrijke mededelingen. Zet op *Live* om te tonen.
- **Site-instellingen** — de notitie onderaan het menu en de taalmelding.

Wijzigingen zijn zichtbaar op de site zodra je op **Publish** klikt.

### Talen

Nederlands en Engels staan altijd naast elkaar in beeld — vul ze allebei in.
Frans voeg je per veld toe met het `+`-knopje als je het wil. Alles wat leeg
blijft, valt op de site terug op het Nederlands. Daarom staat op de menupagina
de melding dat het menu standaard in het Nederlands wordt bijgewerkt.

### Emoji

Bij een categorie klik je een emoji uit het rijtje, of je typt er zelf een in
(Windows: `Win` + `.`).

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

```

Zonder dit valt de site terug op het menu dat vast in `menu.html` staat — de
site blijft dus altijd werken, maar toont dan niet je laatste wijzigingen.

## Vangnet

`menu.html` bevat het volledige menu ook gewoon als HTML. Als Sanity onbereikbaar
is of JavaScript uit staat, ziet de bezoeker dat. Handig, maar het betekent wel
dat die HTML na verloop van tijd veroudert.
