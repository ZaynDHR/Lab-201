// List of pages with their CSS files
const pages = [
  { html: 'album.html',      css: 'assets/Album.css'      },
  { html: 'artiste.html',    css: 'assets/Artiste.css'    },
  { html: 'tournee.html',    css: 'assets/Tournee.css'    },
  { html: 'actualites.html', css: 'assets/Actualites.css' },
];

const container = document.getElementById('pages-container');

// Inject a CSS file into the page if not already loaded
function loadCSS(href) {
  if (!document.querySelector(`link[href="${href}"]`)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }
}

// Fetch each file, extract its <section>, inject into page
async function loadPages() {
  for (const page of pages) {

    // Load the page's CSS into index.html
    loadCSS(page.css);

    // Fetch the HTML file
    const res = await fetch(page.html);
    const html = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const section = doc.querySelector('section');
    if (section) {
      section.classList.remove('page-section');
      container.appendChild(section);
    }
  }

  // Init scroll reveal after all sections are loaded
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

loadPages();