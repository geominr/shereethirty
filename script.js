
const DATA_URL = 'site-data.json';
const STORAGE_KEY = 'lamuBirthdaySiteData';
const AUTH_KEY = 'lamuBirthdaySiteUnlocked';

const escapeHTML = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

function paragraphsHTML(value) {
  const paragraphs = Array.isArray(value) ? value : (value ? [value] : []);
  return paragraphs.map(paragraph => `<p>${escapeHTML(paragraph)}</p>`).join('');
}

function mergeSiteData(base, overlay) {
  if (Array.isArray(overlay)) return overlay;
  if (overlay && typeof overlay === 'object' && base && typeof base === 'object' && !Array.isArray(base)) {
    const merged = { ...base };
    for (const [key, value] of Object.entries(overlay)) {
      merged[key] = mergeSiteData(base[key], value);
    }
    return merged;
  }
  return overlay === undefined ? base : overlay;
}

async function loadSiteData() {
  const response = await fetch(DATA_URL, { cache: 'no-store' });
  if (!response.ok) throw new Error('Could not load site-data.json');
  const bundled = await response.json();
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return bundled;
  try {
    return mergeSiteData(bundled, JSON.parse(saved));
  } catch (e) {
    console.warn('Saved JSON is invalid; loading bundled data.', e);
    return bundled;
  }
}

function requirePassword(data, onUnlock) {
  const gate = document.getElementById('password-gate');
  const shell = document.getElementById('site-shell');
  const form = document.getElementById('gate-form');
  const input = document.getElementById('gate-password');
  const hint = document.getElementById('password-hint');
  const error = document.getElementById('gate-error');
  const expected = String(data.site?.password || '').trim();

  if (!expected || localStorage.getItem(AUTH_KEY) === expected) {
    gate.hidden = true;
    shell.hidden = false;
    onUnlock();
    return;
  }

  hint.textContent = data.site?.passwordHint || '';
  gate.hidden = false;
  shell.hidden = true;
  input.focus();

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (input.value.trim() === expected) {
      localStorage.setItem(AUTH_KEY, expected);
      gate.hidden = true;
      shell.hidden = false;
      onUnlock();
    } else {
      error.textContent = 'That password did not work. Try again.';
      input.select();
    }
  });
}

function buttonHTML(link, fallbackClass = 'inline') {
  const style = link.style || fallbackClass;
  const href = escapeHTML(link.href || '#');
  const external = href.startsWith('http');
  return `<a class="button ${escapeHTML(style)}" href="${href}" ${external ? 'target="_blank" rel="noopener"' : ''}>${escapeHTML(link.label || 'Link')}</a>`;
}

function renderSite(data) {
  document.title = data.site?.title || 'Thirty in Lamu';
  document.querySelector('[data-bind="brandIcon"]').src = data.site?.brandIcon || 'images/brand-icon.svg';
  document.getElementById('footer-text').textContent = data.site?.footerText || '';
  document.getElementById('main-nav').innerHTML = (data.nav || []).map(item => `<a href="${escapeHTML(item.href)}">${escapeHTML(item.label)}</a>`).join('');

  const w = data.welcome;
  const o = data.overview;
  const h = data.house;
  const a = data.activities;
  const f = data.flights;
  const q = data.faq || {};
  const r = data.rsvp;

  const dateCard = (w.dateCard || []).map(item => `<span>${escapeHTML(item.label)}</span><strong>${escapeHTML(item.value)}</strong>`).join('');
  const overviewCards = (o?.cards || []).map(card => `<div><span class="mini-label">${escapeHTML(card.label)}</span><strong>${escapeHTML(card.title)}</strong><small>${escapeHTML(card.text)}</small></div>`).join('');
  const overviewSection = o ? `<section class="section intro-grid" aria-label="Trip overview"><div class="quote reveal"><p>${escapeHTML(o.quote)}</p></div><div class="overview reveal">${overviewCards}</div></section>` : '';
  const houseDetails = (h.details || []).map(d => `<div><span>${escapeHTML(d.label)}</span><strong>${escapeHTML(d.value)}</strong></div>`).join('');
  const gallery = (h.images || []).map((img, i) => {
    const src = typeof img === 'string' ? img : img.src;
    const alt = typeof img === 'string' ? `Forodhani House photo ${i + 1}` : (img.alt || `Forodhani House photo ${i + 1}`);
    return `<img class="house-slide${i === 0 ? ' is-active' : ''}" src="${escapeHTML(src)}" alt="${escapeHTML(alt)}" ${i === 0 ? '' : 'loading="lazy"'} />`;
  }).join('');
  const activities = (a.cards || []).map(card => `
    <article class="activity-card reveal">
      <img src="${escapeHTML(card.image)}" alt="${escapeHTML(card.alt)}" />
      <div><span>${escapeHTML(card.category)}</span><h3>${escapeHTML(card.title)}</h3><p>${escapeHTML(card.text)}</p></div>
    </article>`).join('');
  const flightLegs = (f.legs || []).map(leg => `
    <a class="journey-leg reveal" href="${escapeHTML(leg.href || '#')}" target="_blank" rel="noopener">
      <div class="journey-leg-top">
        <span class="mini-label">${escapeHTML(leg.label || 'Flight')}</span>
        <span class="journey-cta">${escapeHTML(leg.cta || 'Book on Jambojet')}</span>
      </div>
      <div class="journey-route">
        <div>
          <strong>${escapeHTML(leg.departTime || '')}</strong>
          <span>${escapeHTML(leg.departDate || '')}</span>
          <em>${escapeHTML(leg.departAirport || '')}</em>
        </div>
        <div class="journey-meta" aria-hidden="true">
          <small>${escapeHTML(leg.duration || '')}</small>
          <i></i>
          <b>${escapeHTML(leg.flightNumber || '')}</b>
        </div>
        <div>
          <strong>${escapeHTML(leg.arriveTime || '')}</strong>
          <span>${escapeHTML(leg.arriveDate || '')}</span>
          <em>${escapeHTML(leg.arriveAirport || '')}</em>
        </div>
      </div>
    </a>`).join('');
  const rsvpHref = r.href || r.links?.[0]?.href || '#';
  const rsvpChoices = (r.choices || []).map(choice => `
    <a class="rsvp-choice" href="${escapeHTML(choice.href || rsvpHref)}" target="_blank" rel="noopener">
      <img src="${escapeHTML(choice.image || '')}" alt="" />
      <span>${escapeHTML(choice.caption || '')}</span>
    </a>`).join('');
  const faqItems = (q.items || []).map((item, i) => `
    <details class="faq-item reveal"${i === 0 ? ' open' : ''}>
      <summary>${escapeHTML(item.question || '')}</summary>
      <p>${escapeHTML(item.answer || '')}</p>
    </details>`).join('');

  document.documentElement.style.setProperty('--hero-image', `url('${(w.heroImage || '').replaceAll("'", "%27")}')`);
  document.documentElement.style.setProperty('--rsvp-image', `url('${(r.backgroundImage || '').replaceAll("'", "%27")}')`);

  document.getElementById('app').innerHTML = `
    <section class="hero section" id="welcome" aria-labelledby="welcome-title">
      <div class="hero-bg" role="img" aria-label="${escapeHTML(w.heroImageAlt)}"></div>
      <div class="hero-content reveal"><p class="eyebrow">${escapeHTML(w.eyebrow)}</p><h1 id="welcome-title">${escapeHTML(w.headline)}</h1><p class="lede">${escapeHTML(w.lede)}</p><div class="hero-actions">${buttonHTML(w.primaryCta, 'primary')} ${buttonHTML(w.secondaryCta, 'ghost')}</div></div>
      <aside class="date-card reveal" aria-label="Event dates">${dateCard}</aside>
    </section>
    ${overviewSection}
    <section class="section house" id="house" aria-labelledby="house-title">
      <div class="house-visual reveal">
        <div class="house-slideshow" aria-label="Forodhani House photos">${gallery}</div>
        <div class="house-overlay">
          <div class="house-copy">
            <div class="section-kicker">${escapeHTML(h.kicker)}</div>
            <h2 id="house-title">${escapeHTML(h.headline)}</h2>
            ${(h.body || []).map(p => `<p>${escapeHTML(p)}</p>`).join('')}
            <div class="detail-list">${houseDetails}</div>
          </div>
        </div>
      </div>
      ${h.alternatives ? `
      <div class="house-alternatives">
        <div class="section-kicker">${escapeHTML(h.alternatives.headline || 'Alternatives')}</div>
        <p class="alternatives-intro">${escapeHTML(h.alternatives.intro || '')}</p>
        <div class="alternatives-grid">
          ${(h.alternatives.places || []).map(place => `
            <div class="alternative-place">
              <strong>${escapeHTML(place.name || '')}</strong>
              <span>${escapeHTML(place.note || '')}</span>
              <div class="alternative-contacts">
                ${(place.contacts || []).map(contact => {
                  const href = escapeHTML(contact.href || '#');
                  const external = href.startsWith('http');
                  return `<a href="${href}" ${external ? 'target="_blank" rel="noopener"' : ''}>${escapeHTML(contact.label || '')}</a>`;
                }).join('<span aria-hidden="true">·</span>')}
              </div>
            </div>`).join('')}
        </div>
      </div>` : ''}
    </section>
    <section class="section activities" id="activities" aria-labelledby="activities-title"><div class="section-kicker">${escapeHTML(a.kicker)}</div><div class="section-heading reveal"><h2 id="activities-title">${escapeHTML(a.headline)}</h2><p>${escapeHTML(a.intro)}</p></div><div class="activity-grid">${activities}</div></section>
    <section class="section flights" id="flights" aria-labelledby="flights-title">
      <div class="section-kicker">${escapeHTML(f.kicker)}</div>
      <div class="section-heading reveal">
        <h2 id="flights-title">${escapeHTML(f.headline)}</h2>
      </div>
      <div class="flight-intro reveal">${paragraphsHTML(f.intro)}</div>
      <div class="journey-grid">${flightLegs}</div>
      ${f.note ? `<p class="journey-note reveal">${escapeHTML(f.note)}</p>` : ''}
    </section>
    <section class="section faq" id="faq" aria-labelledby="faq-title">
      <div class="section-kicker">${escapeHTML(q.kicker || 'FAQ')}</div>
      <div class="section-heading reveal">
        <h2 id="faq-title">${escapeHTML(q.headline || 'FAQ')}</h2>
        <p>${escapeHTML(q.intro || '')}</p>
      </div>
      <div class="faq-list">${faqItems}</div>
    </section>
    <section class="section rsvp" id="rsvp" aria-label="RSVP"><div class="rsvp-panel reveal"><div class="rsvp-choices">${rsvpChoices}</div></div></section>`;

  window.__LAMU_SITE_DATA__ = data;
  setupInteractions();
}

function setupHouseSlideshow() {
  const slides = [...document.querySelectorAll('.house-slide')];
  if (slides.length < 2) return;
  let index = 0;
  setInterval(() => {
    slides[index].classList.remove('is-active');
    index = (index + 1) % slides.length;
    slides[index].classList.add('is-active');
  }, 4000);
}

function setupInteractions() {
  document.querySelector('.menu-toggle')?.addEventListener('click', () => document.querySelector('.nav').classList.toggle('open'));
  document.querySelectorAll('.nav a').forEach(link => link.addEventListener('click', () => document.querySelector('.nav').classList.remove('open')));
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); }), { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  setupHouseSlideshow();
}

if (!document.body.classList.contains('edit-page')) {
  loadSiteData().then(data => requirePassword(data, () => renderSite(data))).catch(err => {
    document.body.innerHTML = `<main class="editor-wrap"><h1>Could not load site data</h1><p>${escapeHTML(err.message)}</p><p>Open the site through a local server, or make sure <code>site-data.json</code> is next to <code>index.html</code>.</p></main>`;
  });
}
