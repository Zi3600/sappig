/* SAPPIG. — Sanity content layer
   sample by _ziyad._ @ code-caffeine

   The site is static HTML on GitHub Pages, so there is no server to render
   against. This fetches published content straight from Sanity's CDN and
   swaps it in. Everything degrades: if the request fails, is empty, or JS is
   off, the hand-written HTML that ships in the page stays exactly as it is.

   Content shape note: localized fields arrive from
   sanity-plugin-internationalized-array as [{_key:'nl', value:'…'}, …].
   `loc()` resolves those to the active language, always falling back to
   Dutch, because Dutch is what the owner actually maintains. */
(function () {
  'use strict';

  const PROJECT_ID = '2560h915';
  const DATASET = 'production';
  const API_VERSION = 'v2024-10-01';
  const ENDPOINT = `https://${PROJECT_ID}.apicdn.sanity.io/${API_VERSION}/data/query/${DATASET}`;

  const I18N = window.SappigI18n;
  const page = document.body.dataset.page || '';

  const QUERY = `{
    "categories": *[_type == "menuCategory" && status == "visible"]|order(order asc, _createdAt asc){
      _id, emoji, title, subtitle, note, extra,
      "items": items[status != "hidden"]{ _key, name, description, price, badges, status }
    },
    "popups": *[_type == "popup" && status == "live"
        && (!defined(startDate) || startDate <= now())
        && (!defined(endDate) || endDate >= now())]|order(_updatedAt desc){
      _id, _updatedAt, title, message, ctaLabel, ctaUrl, tone,
      trigger, delaySeconds, frequency, showOn,
      "imageUrl": image.asset->url
    },
    "settings": *[_id == "siteSettings"][0]{ menuNote, languageNotice, instagramUrl }
  }`;

  /* ---------------- helpers ---------------- */

  function loc(field) {
    if (typeof field === 'string') return field;
    if (!Array.isArray(field)) return '';
    const lang = I18N ? I18N.lang : 'nl';
    const match =
      field.find((e) => e && e._key === lang && e.value) ||
      field.find((e) => e && e._key === 'nl' && e.value) ||
      field.find((e) => e && e.value);
    return match ? String(match.value) : '';
  }

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;   // textContent, never innerHTML
    return node;
  }

  function fetchContent() {
    const url = `${ENDPOINT}?query=${encodeURIComponent(QUERY)}`;
    return fetch(url, { headers: { Accept: 'application/json' } })
      .then((res) => {
        if (!res.ok) throw new Error(`Sanity responded ${res.status}`);
        return res.json();
      })
      .then((body) => body.result || null);
  }

  /* ---------------- menu ---------------- */

  function renderCategory(cat) {
    const wrap = el('div', 'menu-cat reveal');

    const head = el('div', 'menu-cat__head');
    const h3 = el('h3');
    h3.appendChild(el('span', null, loc(cat.title)));
    const sub = loc(cat.subtitle);
    if (sub) h3.appendChild(el('span', 'tag', sub));
    head.appendChild(h3);
    if (cat.emoji) head.appendChild(el('span', 'emo', cat.emoji));
    wrap.appendChild(head);

    const note = loc(cat.note);
    if (note) wrap.appendChild(el('p', 'menu-cat__note', note));

    (cat.items || []).forEach((item) => {
      const row = el('div', 'menu-item');
      if (item.status === 'soldOut') row.classList.add('menu-item--soldout');

      const name = el('span', 'menu-item__name', loc(item.name));
      (item.badges || []).forEach((badge) => {
        if (badge === 'spicy') name.appendChild(el('span', 'tag tag--hot', '🌶️'));
        if (badge === 'new') name.appendChild(el('span', 'tag', I18N ? I18N.t('menu.new') : 'Nieuw'));
        if (badge === 'favourite') name.appendChild(el('span', 'tag', '★'));
      });
      if (item.status === 'soldOut') {
        name.appendChild(el('span', 'tag tag--out', I18N ? I18N.t('menu.soldOut') : 'Uitverkocht'));
      }
      row.appendChild(name);

      if (item.price) row.appendChild(el('span', 'menu-item__price', item.price));

      const desc = loc(item.description);
      if (desc) row.appendChild(el('span', 'menu-item__desc', desc));

      wrap.appendChild(row);
    });

    const extra = loc(cat.extra);
    if (extra) wrap.appendChild(el('p', 'menu-cat__extra', extra));

    return wrap;
  }

  /* Split categories over the two columns so both end up roughly the same
     height, keeping the owner's ordering intact. */
  function splitColumns(categories) {
    const weight = (c) => (c.items ? c.items.length : 0) + 2;   // +2 for the header block
    const total = categories.reduce((sum, c) => sum + weight(c), 0);
    const left = [];
    const right = [];
    let used = 0;
    categories.forEach((cat) => {
      if (used + weight(cat) / 2 <= total / 2 || left.length === 0) {
        left.push(cat);
        used += weight(cat);
      } else {
        right.push(cat);
      }
    });
    return [left, right];
  }

  function renderMenu(categories) {
    const root = document.getElementById('menu-root');
    if (!root || !categories || !categories.length) return;

    const frag = document.createDocumentFragment();
    splitColumns(categories).forEach((column) => {
      const col = el('div');
      column.forEach((cat) => col.appendChild(renderCategory(cat)));
      frag.appendChild(col);
    });

    root.textContent = '';
    root.appendChild(frag);
    root.removeAttribute('data-menu-fallback');
    if (window.SappigUI && window.SappigUI.observeReveals) {
      window.SappigUI.observeReveals(root);
    }
  }

  function renderSettings(settings) {
    if (!settings) return;
    const note = loc(settings.menuNote);
    const noteEl = document.querySelector('[data-cms="menuNote"]');
    if (note && noteEl) noteEl.textContent = note;

    const notice = loc(settings.languageNotice);
    const noticeEl = document.querySelector('[data-cms="languageNotice"]');
    if (notice && noticeEl) noticeEl.textContent = notice;
  }

  /* ---------------- popups ---------------- */

  /* Key includes the revision, so editing a live message makes it surface
     again for people who already dismissed the previous wording. */
  function seenKey(popup) {
    return `sappig-popup:${popup._id}:${popup._updatedAt || ''}`;
  }

  function alreadySeen(popup) {
    if (popup.frequency === 'always') return false;
    const store = popup.frequency === 'once' ? window.localStorage : window.sessionStorage;
    try {
      return store.getItem(seenKey(popup)) === '1';
    } catch (e) {
      return false;   // private mode: show it, don't crash
    }
  }

  function markSeen(popup) {
    if (popup.frequency === 'always') return;
    const store = popup.frequency === 'once' ? window.localStorage : window.sessionStorage;
    try {
      store.setItem(seenKey(popup), '1');
    } catch (e) { /* private mode */ }
  }

  function openPopup(popup) {
    const lastFocused = document.activeElement;

    const overlay = el('div', `popup popup--${popup.tone || 'info'}`);
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');

    const box = el('div', 'popup__box');
    const titleId = 'popup-title';
    overlay.setAttribute('aria-labelledby', titleId);

    const close = el('button', 'popup__close', '×');
    close.type = 'button';
    close.setAttribute('aria-label', I18N ? I18N.t('popup.close') : 'Sluiten');

    if (popup.imageUrl) {
      const img = el('img', 'popup__img');
      img.src = `${popup.imageUrl}?w=720&fit=max&auto=format`;
      img.alt = '';
      box.appendChild(img);
    }

    const body = el('div', 'popup__body');
    const heading = el('h2', 'popup__title', loc(popup.title));
    heading.id = titleId;
    body.appendChild(heading);

    const message = loc(popup.message);
    if (message) body.appendChild(el('p', 'popup__text', message));

    const ctaLabel = loc(popup.ctaLabel);
    if (ctaLabel && popup.ctaUrl) {
      const cta = el('a', 'btn', ctaLabel);
      cta.href = popup.ctaUrl;
      if (!popup.ctaUrl.startsWith('/') && !popup.ctaUrl.startsWith('#')) {
        cta.target = '_blank';
        cta.rel = 'noopener noreferrer';
      }
      body.appendChild(cta);
    }

    box.appendChild(close);
    box.appendChild(body);
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    if (window.SappigUI) window.SappigUI.lockScroll(true);
    requestAnimationFrame(() => overlay.classList.add('is-open'));
    close.focus();

    function dismiss() {
      markSeen(popup);
      overlay.classList.remove('is-open');
      document.removeEventListener('keydown', onKey, true);
      if (window.SappigUI) window.SappigUI.lockScroll(false);
      setTimeout(() => {
        overlay.remove();
        if (lastFocused && lastFocused.focus) lastFocused.focus();
      }, 260);
    }

    function onKey(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        dismiss();
        return;
      }
      if (e.key !== 'Tab') return;
      /* keep focus inside the dialog */
      const focusable = box.querySelectorAll('button, a[href]');
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    close.addEventListener('click', dismiss);
    overlay.addEventListener('mousedown', (e) => { if (e.target === overlay) dismiss(); });
    document.addEventListener('keydown', onKey, true);
  }

  function schedulePopup(popups) {
    if (!popups || !popups.length) return;

    const forPage = popups.filter((p) => {
      const on = p.showOn || [];
      return !page || !on.length || on.includes(page);
    });
    const popup = forPage.find((p) => !alreadySeen(p));
    if (!popup) return;

    if (popup.trigger === 'load') {
      openPopup(popup);
      return;
    }
    if (popup.trigger === 'delay') {
      setTimeout(() => openPopup(popup), Math.max(0, (popup.delaySeconds || 0) * 1000));
      return;
    }
    /* default: first click anywhere on the site */
    const onFirstClick = (e) => {
      /* let a real navigation happen instead of hijacking it */
      if (e.target.closest && e.target.closest('a[href], button')) return;
      document.removeEventListener('click', onFirstClick, true);
      openPopup(popup);
    };
    document.addEventListener('click', onFirstClick, true);
  }

  /* ---------------- boot ---------------- */

  let cache = null;

  fetchContent()
    .then((result) => {
      if (!result) return;
      cache = result;
      renderMenu(result.categories);
      renderSettings(result.settings);
      schedulePopup(result.popups);
    })
    .catch((err) => {
      /* Static HTML already on the page stands in — nothing to repair. */
      console.warn('[sappig] falling back to built-in content:', err.message);
    });

  /* Re-render CMS content when the visitor switches language. */
  document.addEventListener('sappig:lang', () => {
    if (!cache) return;
    renderMenu(cache.categories);
    renderSettings(cache.settings);
  });
})();
