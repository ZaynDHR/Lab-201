// ─── PAGES À INJECTER ─────────────────────────────────────
const pages = [
  { html: './pages/album.html',      css: '../assets/Album.css'      },
  { html: './pages/artiste.html',    css: '../assets/Artiste.css'    },
  { html: './pages/tournee.html',    css: '../assets/Tournee.css'    },
  { html: './pages/actualites.html', css: '../assets/Actualites.css' },
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

// ─── CHARGER LES CONCERTS ─────────────────────────────────
async function loadConcerts() {
  const list = document.getElementById('tour-list');
  if (!list) return;

  try {
    const { supabase } = await import('./supabase.js');

    const { data, error } = await supabase
      .from('concerts')
      .select('*')
      .order('date_concert', { ascending: true });

    if (error || !data || !data.length) {
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

    initReveal();

    supabase
      .channel('home-concerts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'concerts' }, () => {
        loadConcerts();
      })
      .subscribe();

  } catch (e) {
    console.warn('Supabase non disponible:', e);
    list.innerHTML = `<div class="tour-empty">Aucune date annoncée pour le moment.</div>`;
  }
}

// ─── CHARGER LES PAGES ────────────────────────────────────
async function loadPages() {
  for (const page of pages) {
    try {
      loadCSS(page.css);

      const res = await fetch(page.html);
      if (!res.ok) throw new Error(`Erreur HTTP ${res.status} pour ${page.html}`);

      const html = await res.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // On prend uniquement la <section> principale, pas le nav ni le footer
      const section = doc.querySelector('section');

      if (section) {
        container.appendChild(section);
      } else {
        console.warn(`Pas de <section> trouvée dans ${page.html}`);
      }
    } catch (e) {
      console.error(`Impossible de charger ${page.html}:`, e);
    }
  }

  await loadConcerts();
  initReveal();
}

loadPages();