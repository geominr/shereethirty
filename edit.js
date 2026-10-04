
let siteData;
const tabs = [
  ['site','Site settings'], ['welcome','Welcome'], ['overview','Overview'], ['house','House'], ['activities','Activities'], ['flights','Flights'], ['faq','FAQ'], ['rsvp','RSVP'], ['raw','Raw JSON']
];

const pathGet = (obj, path) => path.split('.').reduce((acc, key) => acc?.[key], obj);
const pathSet = (obj, path, value) => {
  const parts = path.split('.');
  const last = parts.pop();
  const target = parts.reduce((acc, key) => acc[key], obj);
  target[last] = value;
};
const slug = (value) => String(value).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'') || 'item';

function field(label, path, type='text', rows=3) {
  const value = pathGet(siteData, path) ?? '';
  const id = slug(path);
  const input = type === 'textarea'
    ? `<textarea id="${id}" data-path="${path}" rows="${rows}">${escapeHTML(value)}</textarea>`
    : `<input id="${id}" data-path="${path}" value="${escapeHTML(value)}" />`;
  return `<div class="field"><label for="${id}">${escapeHTML(label)}</label>${input}</div>`;
}

function bindFields() {
  document.querySelectorAll('[data-path]').forEach(input => input.addEventListener('input', () => pathSet(siteData, input.dataset.path, input.value)));
}

function renderArrayEditor(title, arr, renderCard, addNew) {
  return `<div class="repeat-header"><h2>${escapeHTML(title)}</h2><button class="small-button" data-add="${escapeHTML(title)}">Add</button></div>${arr.map(renderCard).join('')}`;
}

function renderPanel(tab) {
  const panel = document.getElementById('editor-panel');
  if (tab === 'site') panel.innerHTML = `<h2>Site settings</h2>${field('Browser title','site.title')}${field('Brand icon path','site.brandIcon')}${field('Loose password','site.password')}${field('Password hint','site.passwordHint','textarea')}${field('Footer text','site.footerText')}`;
  if (tab === 'welcome') panel.innerHTML = `<h2>Welcome page</h2>${field('Eyebrow','welcome.eyebrow')}${field('Headline','welcome.headline')}${field('Lede','welcome.lede','textarea',5)}${field('Hero image URL','welcome.heroImage')}${field('Hero image alt text','welcome.heroImageAlt')}${field('Primary CTA label','welcome.primaryCta.label')}${field('Primary CTA link','welcome.primaryCta.href')}${field('Secondary CTA label','welcome.secondaryCta.label')}${field('Secondary CTA link','welcome.secondaryCta.href')}`;
  if (tab === 'overview') panel.innerHTML = siteData.overview
    ? `<h2>Overview</h2>${field('Quote','overview.quote','textarea',4)}${siteData.overview.cards.map((card,i)=>`<div class="repeat-card"><div class="repeat-header"><strong>Overview card ${i+1}</strong></div>${field('Label',`overview.cards.${i}.label`)}${field('Title',`overview.cards.${i}.title`)}${field('Text',`overview.cards.${i}.text`)}</div>`).join('')}`
    : `<h2>Overview</h2><p class="muted">This section is not in site-data.json.</p>`;
  if (tab === 'house') panel.innerHTML = `<h2>House page</h2>${field('Kicker','house.kicker')}${field('Headline','house.headline')}${siteData.house.body.map((_,i)=>field(`Body paragraph ${i+1}`,`house.body.${i}`,'textarea',4)).join('')}${siteData.house.details.map((_,i)=>`<div class="repeat-card"><strong>Detail ${i+1}</strong>${field('Label',`house.details.${i}.label`)}${field('Value',`house.details.${i}.value`)}</div>`).join('')}${siteData.house.alternatives?`<div class="repeat-card"><strong>Alternatives</strong>${field('Headline','house.alternatives.headline')}${field('Intro','house.alternatives.intro','textarea',3)}${(siteData.house.alternatives.places||[]).map((_,i)=>`<div class="repeat-card"><strong>Place ${i+1}</strong>${field('Name',`house.alternatives.places.${i}.name`)}${field('Note',`house.alternatives.places.${i}.note`)}${(siteData.house.alternatives.places[i].contacts||[]).map((__,ci)=>`${field('Contact label',`house.alternatives.places.${i}.contacts.${ci}.label`)}${field('Contact link',`house.alternatives.places.${i}.contacts.${ci}.href`)}`).join('')}</div>`).join('')}</div>`:''}${(siteData.house.images||[]).map((_,i)=>`<div class="repeat-card"><strong>Gallery image ${i+1}</strong>${field('Image path',`house.images.${i}`)}</div>`).join('')}`;
  if (tab === 'activities') panel.innerHTML = `<h2>Activities</h2>${field('Kicker','activities.kicker')}${field('Headline','activities.headline')}${field('Intro','activities.intro','textarea',4)}${siteData.activities.cards.map((_,i)=>`<div class="repeat-card"><div class="repeat-header"><strong>Activity ${i+1}</strong><button class="small-button" data-remove-activity="${i}">Remove</button></div>${field('Category',`activities.cards.${i}.category`)}${field('Title',`activities.cards.${i}.title`)}${field('Text',`activities.cards.${i}.text`,'textarea',3)}${field('Image URL',`activities.cards.${i}.image`)}${field('Alt text',`activities.cards.${i}.alt`)}</div>`).join('')}<button class="small-button" id="add-activity">Add activity</button>`;
  if (tab === 'flights') panel.innerHTML = `<h2>Flights</h2>${field('Kicker','flights.kicker')}${field('Headline','flights.headline')}${Array.isArray(siteData.flights?.intro) ? siteData.flights.intro.map((_,i)=>field(`Intro paragraph ${i+1}`,`flights.intro.${i}`,'textarea',3)).join('') : field('Intro','flights.intro','textarea',4)}${field('Note','flights.note','textarea',3)}${(siteData.flights.legs||[]).map((_,i)=>`<div class="repeat-card"><strong>Leg ${i+1}</strong>${field('Label',`flights.legs.${i}.label`)}${field('CTA',`flights.legs.${i}.cta`)}${field('Booking URL',`flights.legs.${i}.href`)}${field('Depart time',`flights.legs.${i}.departTime`)}${field('Depart date',`flights.legs.${i}.departDate`)}${field('Depart airport',`flights.legs.${i}.departAirport`)}${field('Duration',`flights.legs.${i}.duration`)}${field('Flight number',`flights.legs.${i}.flightNumber`)}${field('Arrive time',`flights.legs.${i}.arriveTime`)}${field('Arrive date',`flights.legs.${i}.arriveDate`)}${field('Arrive airport',`flights.legs.${i}.arriveAirport`)}</div>`).join('')}`;
  if (tab === 'faq') panel.innerHTML = `<h2>FAQ</h2>${field('Kicker','faq.kicker')}${field('Headline','faq.headline')}${field('Intro','faq.intro','textarea',4)}${(siteData.faq?.items||[]).map((_,i)=>`<div class="repeat-card"><div class="repeat-header"><strong>Question ${i+1}</strong><button class="small-button" data-remove-faq="${i}">Remove</button></div>${field('Question',`faq.items.${i}.question`)}${field('Answer',`faq.items.${i}.answer`,'textarea',4)}</div>`).join('')}<button class="small-button" id="add-faq">Add question</button>`;
  if (tab === 'rsvp') panel.innerHTML = `<h2>RSVP</h2>${field('Partiful link','rsvp.href')}${field('Background image URL','rsvp.backgroundImage')}${(siteData.rsvp.choices||[]).map((_,i)=>`<div class="repeat-card"><strong>Choice ${i+1}</strong>${field('Image path',`rsvp.choices.${i}.image`)}${field('Caption',`rsvp.choices.${i}.caption`)}</div>`).join('')}`;
  if (tab === 'raw') panel.innerHTML = `<h2>Raw JSON</h2><p class="muted">Advanced: edit the full data object directly.</p><textarea class="json-box" id="raw-json">${escapeHTML(JSON.stringify(siteData,null,2))}</textarea><button class="small-button" id="apply-raw">Apply raw JSON</button>`;
  bindFields();
  bindButtons(tab);
}

function bindButtons(tab) {
  document.querySelectorAll('[data-remove-activity]').forEach(btn => btn.addEventListener('click', () => { siteData.activities.cards.splice(Number(btn.dataset.removeActivity),1); renderPanel(tab); }));
  document.getElementById('add-activity')?.addEventListener('click', () => { siteData.activities.cards.push({category:'New activity',title:'Activity title',text:'Short description.',image:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',alt:'Activity image'}); renderPanel(tab); });
  document.querySelectorAll('[data-remove-faq]').forEach(btn => btn.addEventListener('click', () => { siteData.faq.items.splice(Number(btn.dataset.removeFaq),1); renderPanel(tab); }));
  document.getElementById('add-faq')?.addEventListener('click', () => { if (!siteData.faq) siteData.faq = {kicker:'Good to know',headline:'FAQ',intro:'',items:[]}; siteData.faq.items.push({question:'New question?',answer:'Placeholder answer.'}); renderPanel(tab); });
  document.getElementById('apply-raw')?.addEventListener('click', () => { try { siteData = JSON.parse(document.getElementById('raw-json').value); alert('Raw JSON applied. Save or download when ready.'); } catch(e) { alert('Invalid JSON: ' + e.message); } });
}

function setupTabs() {
  const nav = document.getElementById('editor-tabs');
  nav.innerHTML = tabs.map(([id,label],i)=>`<button class="${i===0?'active':''}" data-tab="${id}">${label}</button>`).join('');
  nav.querySelectorAll('button').forEach(btn => btn.addEventListener('click', () => {
    nav.querySelectorAll('button').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    renderPanel(btn.dataset.tab);
  }));
}

function downloadJSON() {
  const blob = new Blob([JSON.stringify(siteData,null,2)], { type:'application/json' });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), { href:url, download:'site-data.json' });
  document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}

loadSiteData().then(data => {
  siteData = data;
  setupTabs();
  renderPanel('site');
  document.getElementById('save-browser').addEventListener('click', () => { localStorage.setItem(STORAGE_KEY, JSON.stringify(siteData)); alert('Saved to this browser. Open Preview site to see it.'); });
  document.getElementById('download-json').addEventListener('click', downloadJSON);
  document.getElementById('copy-json').addEventListener('click', async () => { await navigator.clipboard.writeText(JSON.stringify(siteData,null,2)); alert('Copied JSON.'); });
  document.getElementById('reset-browser').addEventListener('click', () => { localStorage.removeItem(STORAGE_KEY); localStorage.removeItem(AUTH_KEY); alert('Browser edits and saved password were cleared. Refresh to reload bundled site-data.json.'); });
});
