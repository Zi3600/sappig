/* SAPPIG. — i18n (NL default · EN · FR)
   sample by _ziyad._ @ code-caffeine

   Markup contract:
     data-i18n="key"        -> sets textContent
     data-i18n-html="key"   -> sets innerHTML (for copy with <br>/<strong>)
     data-i18n-aria="key"   -> sets aria-label
   Dutch stays in the HTML as the source of truth / no-JS fallback and is
   snapshotted from the DOM at init, so the dictionary only carries EN + FR.
   Language auto-detects from the browser; anything outside NL/EN/FR -> NL. */

(function () {
  'use strict';

  const LANGS = ['nl', 'en', 'fr'];
  const DEFAULT = 'nl';
  const STORE_KEY = 'sappig-lang';

  /* ---------------- Dictionary (EN + FR; NL snapshotted from HTML) ---------------- */
  const T = {
    /* ---- nav + fullscreen menu ---- */
    'nav.open':     { en: 'Open menu', fr: 'Ouvrir le menu' },
    'nav.close':    { en: 'Close menu', fr: 'Fermer le menu' },
    'nav.language': { en: 'Language', fr: 'Langue' },
    'fs.home':      { en: 'Home', fr: 'Accueil' },
    'fs.menu':      { en: 'Menu', fr: 'La carte' },
    'fs.findus':    { en: 'Find us', fr: 'Nous trouver' },
    'fs.legal':     { en: 'Legal', fr: 'Mentions légales' },

    /* ---- hero ---- */
    'hero.eyebrow': { en: '100% plant-based · Hasselt', fr: '100 % végétal · Hasselt' },
    'hero.sub':     { en: 'Smoothies, juices and plant-based bites.', fr: 'Smoothies, jus et bouchées végétales.' },
    'hero.cta1':    { en: 'Check out our menu', fr: 'Découvrez notre carte' },
    'hero.cta2':    { en: 'Check out our Instagram', fr: 'Notre Instagram' },

    /* ---- instagram strip ---- */
    'ig.eyebrow': { en: 'From our feed', fr: 'De notre feed' },
    'ig.h2':      { en: 'A peek inside', fr: 'Un coup d’œil à l’intérieur' },
    'ig.cta':     { en: 'Follow @sappig.juicebar', fr: 'Suivez @sappig.juicebar' },
    'ig.prev':    { en: 'Previous photo', fr: 'Photo précédente' },
    'ig.next':    { en: 'Next photo', fr: 'Photo suivante' },

    /* ---- reviews ---- */
    'rev.eyebrow': { en: 'Reviews', fr: 'Avis' },
    'rev.h2':      { en: 'See what our customers have got to say', fr: 'Découvrez ce que nos clients en disent' },
    'rev.label':   { en: 'Customer reviews', fr: 'Avis clients' },

    /* ---- hours ---- */
    'hrs.num':      { en: 'Opening hours', fr: 'Horaires' },
    'hrs.h2':       { en: 'Come say hi', fr: 'Passez nous voir' },
    'hrs.weekdays': { en: 'Wed – Fri', fr: 'mer – ven' },
    'hrs.saturday': { en: 'Saturday', fr: 'samedi' },
    'hrs.koop':     { en: 'Shopping Sunday', fr: 'Dimanche ouvert' },
    'hrs.koopSub':  { en: '1st Sunday of the month', fr: '1er dimanche du mois' },
    'hrs.after':    { en: 'Afterwork', fr: 'Afterwork' },
    'hrs.afterSub': { en: '2nd Friday of the month', fr: '2e vendredi du mois' },
    'hrs.closed':   { en: 'Closed on Sunday (except shopping Sunday), Monday and Tuesday.', fr: 'Fermé le dimanche (sauf dimanche ouvert), le lundi et le mardi.' },
    'hrs.cta':      { en: 'Plan your visit', fr: 'Préparez votre visite' },

    /* ---- visit / locate ---- */
    'visit.eyebrow':    { en: 'Visit us', fr: 'Venez nous voir' },
    'visit.h2':         { en: 'Find us in the heart of Hasselt', fr: 'Trouvez-nous au cœur de Hasselt' },
    'visit.hoursLabel': { en: 'Opening hours', fr: 'Horaires' },
    'visit.hoursSummary': {
      en: 'Wed – Fri · 12:00 – 18:00<br>Sat · 11:00 – 18:00<br>Shopping Sunday (1st of the month) · 12:00 – 17:00<br>Afterwork (2nd Friday) · 18:00 – 21:00',
      fr: 'mer – ven · 12:00 – 18:00<br>sam · 11:00 – 18:00<br>Dimanche ouvert (1er du mois) · 12:00 – 17:00<br>Afterwork (2e vendredi) · 18:00 – 21:00'
    },
    'visit.followLabel': { en: 'Follow us', fr: 'Suivez-nous' },
    'visit.directions':  { en: 'Directions', fr: 'Itinéraire' },

    /* ---- footer ---- */
    'footer.tag': { en: 'Smoothies, juices and plant-based bites in the heart of Hasselt.',
                    fr: 'Smoothies, jus et bouchées végétales au cœur de Hasselt.' },
    'footer.explore': { en: 'Explore', fr: 'Explorer' },
    'footer.visit':   { en: 'Visit', fr: 'Visiter' },
    'footer.rights':  { en: '© <span id="year">2026</span> SAPPIG. All rights reserved.',
                        fr: '© <span id="year">2026</span> SAPPIG. Tous droits réservés.' },

    /* ---- menu page ---- */
    'menup.eyebrow': { en: '100% vegan · Hasselt', fr: '100 % végétal · Hasselt' },
    'menup.h1':      { en: 'The menu', fr: 'La carte' },
    'menup.lead':    { en: 'Everything fresh, everything plant-based.', fr: 'Tout est frais, tout est végétal.' },

    /* ---- menu: language notice + live-menu states ---- */
    'menu.langNote': {
      en: 'Our menu is updated in Dutch by default. Would you like a change in another language? <a href="https://www.instagram.com/sappig.juicebar/" target="_blank" rel="noopener">Send us a message</a> and we’ll sort it out.',
      fr: 'Notre carte est mise à jour en néerlandais par défaut. Vous souhaitez une modification dans une autre langue ? <a href="https://www.instagram.com/sappig.juicebar/" target="_blank" rel="noopener">Envoyez-nous un message</a> et on s’en occupe.'
    },
    'menu.soldOut':  { en: 'Sold out', fr: 'Épuisé' },
    'menu.new':      { en: 'New', fr: 'Nouveau' },
    'menu.updated':  { en: 'Menu last updated', fr: 'Carte mise à jour le' },

    /* ---- popup ---- */
    'popup.close':   { en: 'Close message', fr: 'Fermer le message' },


    'c.smoothies':    { en: 'Smoothies', fr: 'Smoothies' },
    'c.smoothiesSub': { en: '100% fruit', fr: '100 % fruits' },
    'c.sapjes':       { en: 'Juices', fr: 'Jus' },
    'c.sapjesSub':    { en: '100% fruit & veg', fr: '100 % fruits & légumes' },
    'c.sapjesExtra':  { en: 'Extra ginger shot + € 0,70', fr: 'Shot de gingembre en plus + 0,70 €' },
    'c.shakes':       { en: 'Shakes', fr: 'Shakes' },
    'c.protein':      { en: 'Protein Shakes', fr: 'Shakes protéinés' },
    'c.bubble':       { en: 'Bubble Tea', fr: 'Bubble Tea' },
    'c.iced':         { en: 'Blended Iced Lattes', fr: 'Blended Iced Lattes' },
    'c.icedExtra':    { en: 'Syrup shot (caramel / cinnamon / speculoos / vanilla / strawberry / mango / coconut drink instead of oat drink) + € 0,50',
                        fr: 'Shot de sirop (caramel / cannelle / spéculoos / vanille / fraise / mangue / boisson coco au lieu de la boisson avoine) + 0,50 €' },
    'c.warm':         { en: 'Hot drinks', fr: 'Boissons chaudes' },
    'c.lunch':        { en: 'Lunch', fr: 'Lunch' },

    'd.strawberryfields': { en: 'strawberry, banana, mango, apple juice', fr: 'fraise, banane, mangue, jus de pomme' },
    'd.orangestrawberry': { en: 'strawberry, banana, mango, orange juice', fr: 'fraise, banane, mangue, jus d’orange' },
    'd.framboezel':       { en: 'raspberry, mango, apple juice', fr: 'framboise, mangue, jus de pomme' },
    'd.purpledisco':      { en: 'forest fruits, mango, apple juice', fr: 'fruits des bois, mangue, jus de pomme' },
    'd.pineappleexpress': { en: 'pineapple, mango, apple juice', fr: 'ananas, mangue, jus de pomme' },
    'd.tropicthunder':    { en: 'pineapple, banana, passion fruit, orange juice', fr: 'ananas, banane, fruit de la passion, jus d’orange' },
    'd.greenvelvet':      { en: 'celery, cucumber, lime juice, apple juice', fr: 'céleri, concombre, jus de citron vert, jus de pomme' },
    'd.clockwork':        { en: 'carrot, ginger, orange juice', fr: 'carotte, gingembre, jus d’orange' },
    'd.hangover':         { en: 'spinach, banana, mango, apple juice', fr: 'épinards, banane, mangue, jus de pomme' },
    'd.trueblood':        { en: 'celery, lime juice, tabasco, tomato juice', fr: 'céleri, jus de citron vert, tabasco, jus de tomate' },
    'd.cocomint':         { en: 'pineapple, mango, mint, coconut drink', fr: 'ananas, mangue, menthe, boisson coco' },
    'd.pinkshake':        { en: 'strawberry, banana, vanilla drink', fr: 'fraise, banane, boisson vanille' },
    'd.darkshake':        { en: 'banana, choco drink', fr: 'banane, boisson choco' },
    'd.bananashake':      { en: 'banana, banana drink', fr: 'banane, boisson banane' },
    'd.coffeenator':      { en: 'Fyve coffee protein powder, banana, oat drink', fr: 'poudre protéinée café Fyve, banane, boisson avoine' },
    'd.tropicalmatcha':   { en: 'Fyve matcha protein powder, mango, pineapple, coconut drink', fr: 'poudre protéinée matcha Fyve, mangue, ananas, boisson coco' },

    'n.peachtea':  { en: 'Peach black tea', fr: 'Thé noir pêche' },
    'd.peachtea':  { en: 'with mango bubbles', fr: 'aux billes de mangue' },
    'n.foresttea': { en: 'Forest fruit black tea', fr: 'Thé noir fruits des bois' },
    'd.foresttea': { en: 'with strawberry bubbles', fr: 'aux billes de fraise' },
    'd.oat':       { en: 'with oat drink', fr: 'avec boisson avoine' },

    'n.koffie':    { en: 'Coffee / Decaf / Espresso', fr: 'Café / Déca / Espresso' },
    'n.thee':      { en: 'Loose leaf tea', fr: 'Thé en vrac' },
    'd.thee':      { en: 'red / yellow / green / black', fr: 'rouge / jaune / vert / noir' },
    'n.muntthee':  { en: 'Fresh mint or ginger tea', fr: 'Thé frais menthe ou gingembre' },

    'n.soep':      { en: 'Soup of the day', fr: 'Soupe du jour' },
    'd.soep':      { en: 'with apple and bread', fr: 'avec pomme et pain' },
    'n.brood':     { en: 'Bread white / brown', fr: 'Pain blanc / brun' },
    'd.brood':     { en: 'with veggies and topping — choice of ‘mortadella and cheese’, ‘egg salad’, ‘filet americain’, smoked ‘salmon’ with sour cream, or tonino',
                     fr: 'avec légumes et garniture — au choix : « mortadella et fromage », « salade d’œufs », « filet americain », « saumon » fumé à la crème aigre, ou tonino' },
    'n.quiche':    { en: 'Quiche of the day', fr: 'Quiche du jour' },
    'd.quiche':    { en: 'with salad and mustard dressing', fr: 'avec salade et vinaigrette à la moutarde' },
    'd.tofu':      { en: 'with salad and mustard dressing', fr: 'avec salade et vinaigrette à la moutarde' },
    'd.bowl':      { en: 'with rice, salad and tofu/tempeh', fr: 'avec riz, salade et tofu/tempeh' },
    'd.curry':     { en: 'with rice and salad', fr: 'avec riz et salade' },
    'd.schnitzel': { en: 'with mash, salad and apple sauce', fr: 'avec purée, salade et compote de pommes' },
    'd.duchesse':  { en: 'with pommes duchesse and salad', fr: 'avec pommes duchesse et salade' },

    'menu.veganNote': { en: 'Everything on our menu is 100% plant-based.', fr: 'Tout sur notre carte est 100 % végétal.' },
    'mcta.h2':  { en: 'Craving it yet?', fr: 'L’eau à la bouche ?' },
    'mcta.btn': { en: 'Find us in Hasselt', fr: 'Trouvez-nous à Hasselt' },

    /* ---- legal page (body copy stays in Dutch — legal text is not translated) ---- */
    'legalp.h1':   { en: 'SAPPIG privacy policy', fr: 'Politique de confidentialité de SAPPIG' },
    'legalp.lead': { en: 'Version: August 2, 2026', fr: 'Version : 2 août 2026' }
  };

  /* -------- snapshot inline NL from the DOM as the nl dictionary -------- */
  function snapshot() {
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const k = el.getAttribute('data-i18n');
      if (T[k] && T[k].nl == null) T[k].nl = el.textContent;
    });
    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
      const k = el.getAttribute('data-i18n-html');
      if (T[k] && T[k].nl == null) T[k].nl = el.innerHTML;
    });
    document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
      const k = el.getAttribute('data-i18n-aria');
      if (T[k] && T[k].nl == null) T[k].nl = el.getAttribute('aria-label');
    });
  }

  function detect() {
    try {
      const stored = localStorage.getItem(STORE_KEY);
      if (stored && LANGS.includes(stored)) return stored;
    } catch (e) { /* private mode */ }
    const wanted = (navigator.languages && navigator.languages.length)
      ? navigator.languages : [navigator.language || DEFAULT];
    for (const tag of wanted) {
      const base = String(tag).slice(0, 2).toLowerCase();
      if (LANGS.includes(base)) return base;
    }
    return DEFAULT;
  }

  function apply(lang) {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const t = T[el.getAttribute('data-i18n')];
      if (t && t[lang] != null) el.textContent = t[lang];
    });
    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
      const t = T[el.getAttribute('data-i18n-html')];
      if (t && t[lang] != null) el.innerHTML = t[lang];
    });
    document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
      const t = T[el.getAttribute('data-i18n-aria')];
      if (t && t[lang] != null) el.setAttribute('aria-label', t[lang]);
    });
    document.querySelectorAll('[data-lang-option]').forEach((btn) => {
      btn.setAttribute('aria-pressed', btn.getAttribute('data-lang-option') === lang ? 'true' : 'false');
    });
  }

  let current = DEFAULT;

  function setLang(lang) {
    if (!LANGS.includes(lang)) lang = DEFAULT;
    current = lang;
    try { localStorage.setItem(STORE_KEY, lang); } catch (e) { /* private mode */ }
    apply(lang);
    document.dispatchEvent(new CustomEvent('sappig:lang', { detail: { lang } }));
  }

  snapshot();
  current = detect();
  apply(current);

  document.querySelectorAll('[data-lang-option]').forEach((btn) => {
    btn.addEventListener('click', () => setLang(btn.getAttribute('data-lang-option')));
  });

  /* -------- public API, used by sanity.js for CMS-driven content --------
     `pick` resolves a {nl,en,fr} object from Sanity to the active language,
     always falling back to Dutch because that is what the owner edits. */
  window.SappigI18n = {
    langs: LANGS,
    fallback: DEFAULT,
    get lang() { return current; },
    set: setLang,
    t(key) {
      const entry = T[key];
      return (entry && (entry[current] != null ? entry[current] : entry[DEFAULT])) || '';
    },
    pick(field) {
      if (field == null) return '';
      if (typeof field === 'string') return field;
      return field[current] || field[DEFAULT] || '';
    },
    /* re-translate the static bits after new markup is injected */
    refresh() { apply(current); },
    onChange(cb) {
      document.addEventListener('sappig:lang', (e) => cb(e.detail.lang));
    }
  };
})();
