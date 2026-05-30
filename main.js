import { supabase } from './assets/js/supabase.js';

// ─── PAGES À INJECTER ─────────────────────────────────────
const pages = [
  { html: 'album.html',      css: 'assets/Album.css'      },
  { html: 'artiste.html',    css: 'assets/Artiste.css'    },
  { html: 'tournee.html',    css: 'assets/Tournee.css'    },
  { html: 'actualites.html', css: 'assets/Actualites.css' },
];

const container = document.getElementById('pages-container');

// ─── INJECTER UN CSS ──────────────────────────────────────
function loadCSS(href) {
  if (!document.querySelector(`link[href="${href}"]`)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }
}

// ─── FORMAT DATE ──────────────────────────────────────────
function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const day   = d.toLocaleDateString('fr-FR', { day: '2-digit' });
  const month = d.toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase().replace('.', '');
  return `${day} ${month}`;
}

// ─── CHARGER LES CONCERTS DANS #tour ──────────────────────
async function loadConcerts() {
  const { data, error } = await supabase
    .from('concerts')
    .select('*')
    .order('date_concert', { ascending: true });

  const list = document.getElementById('tour-list');
  if (!list) return;

  if (error || !data.length) {
    list.innerHTML = `<div class="tour-empty">Aucune date annoncée pour le moment.</div>`;
    return;
  }

  list.innerHTML = data.map(c => `
    <div class="tour-item reveal">
      <div class="tour-date">${formatDate(c.date_concert)}</div>
      <div>
        <div class="tour-city">${c.ville}</div>
        <div class="tour-venue">${c.lieu}</div>
      </div>
      <div class="tour-country">${c.pays}</div>
      ${c.sold_out
        ? `<span class="tour-ticket sold-out">Complet</span>`
        : `<a href="tournee.html" class="tour-ticket">Billetterie</a>`
      }
    </div>
  `).join('');

  // Scroll reveal sur les nouveaux éléments
  initReveal();
}

// ─── SCROLL REVEAL ────────────────────────────────────────
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal:not(.visible)').forEach(el => observer.observe(el));
}

// ─── CHARGER LES PAGES ────────────────────────────────────
async function loadPages() {
  for (const page of pages) {
    loadCSS(page.css);

    const res  = await fetch(page.html);
    const html = await res.text();
    const parser  = new DOMParser();
    const doc     = parser.parseFromString(html, 'text/html');
    const section = doc.querySelector('section');

    if (section) {
      section.classList.remove('page-section');
      container.appendChild(section);
    }
  }

  // Remplacer le contenu statique de #tour par les données Supabase
  await loadConcerts();

  // Temps réel — si admin modifie une date, la home se met à jour
  supabase
    .channel('home-concerts')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'concerts' }, () => {
      loadConcerts();
    })
    .subscribe();

  initReveal();
}

loadPages();