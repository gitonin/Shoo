/* =============================================================
   SHOO Coffee — Main JS v2
   SPA router · carousel · menu · FAQ · newsletter
============================================================= */

/* ── Données produits ────────────────────────────────────── */
const PRODUCTS = {
  ethiopie: {
    id:        'ethiopie',
    name:      'Éthiopie Yirgacheffe',
    origin:    'Éthiopie · Yirgacheffe',
    notes:     'Floral · Bergamote · Miel d\'acacia',
    gradient:  'grad--ethiopie',
    desc:      'Né à 2 000 mètres d\'altitude dans les forêts d\'Afrique de l\'Est, ce café lavé (washed) révèle une complexité florale remarquable. Ses arômes de jasmin et de bergamote s\'accompagnent d\'une douceur miellée en fin de tasse.',
    prices:    { '250': 18, '500': 32 },
    badge:     'Coup de cœur',
  },
  colombie: {
    id:       'colombie',
    name:     'Colombie Huila',
    origin:   'Colombie · Huila',
    notes:    'Caramel · Noisette · Agrumes doux',
    gradient: 'grad--colombie',
    desc:     'Le département du Huila produit certains des meilleurs cafés de Colombie. Cultivé en altitude dans les Andes, ce café filtre révèle un profil rond et gourmand, avec des notes de caramel, de noisette grillée et une touche d\'agrumes en rétro-olfaction.',
    prices:   { '250': 17, '500': 30 },
    badge:    null,
  },
  guatemala: {
    id:       'guatemala',
    name:     'Guatemala Huehuetenango',
    origin:   'Guatemala · Huehuetenango',
    notes:    'Cacao · Épices · Fruits rouges',
    gradient: 'grad--guatemala',
    desc:     'Huehuetenango est l\'une des régions caféières les plus isolées du Guatemala. Les vents chauds du Mexique protègent les caféiers du gel, permettant une culture à très haute altitude. Le résultat est un café dense, épicé, avec une belle acidité fruitée.',
    prices:   { '250': 19, '500': 34 },
    badge:    null,
  },
  signature: {
    id:       'signature',
    name:     'L\'Assemblage Noir',
    origin:   'Gamme Signature',
    notes:    'Chocolat noir · Tabac blond · Cerise mûre',
    gradient: 'grad--signature',
    desc:     'Une rencontre entre trois origines travaillées pour l\'espresso. Dense, rond, avec cette amertume douce qu\'on recherche dans un ristretto du matin. Notre réponse à ce que devrait être un café de tous les jours — impeccable, chaque tasse.',
    prices:   { '250': 22, '500': 38 },
    badge:    'Signature',
  },
};

/* ── Routeur SPA ─────────────────────────────────────────── */
let currentPage = 'home';

function navigate(pageId, productId) {
  // Fermer le menu si ouvert
  closeMenu();

  if (pageId === 'produit' && productId) {
    renderProductPage(productId);
  }

  const pages = document.querySelectorAll('.page');
  pages.forEach(p => p.classList.remove('active'));

  const target = document.getElementById(`page-${pageId}`);
  if (target) {
    target.classList.add('active');
    currentPage = pageId;
  }

  window.scrollTo({ top: 0, behavior: 'instant' });

  // Mettre à jour l'état du nav
  document.getElementById('nav').classList.remove('scrolled');
}

/* ── Rendu page produit dynamique ────────────────────────── */
function renderProductPage(productId) {
  const p = PRODUCTS[productId];
  if (!p) return;

  const container = document.getElementById('productContent');
  container.innerHTML = `
    <div class="produit">
      <div class="produit__hero">
        <div class="produit__hero-visual ${p.gradient}"></div>
      </div>
      <div class="produit__body">
        <button class="produit__back" data-back>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M10 3L5 8l5 5" stroke="currentColor" stroke-width="1.2"/>
          </svg>
          Nos cafés
        </button>
        <div class="produit__grid">
          <div class="produit__info">
            <p class="produit__origin">${p.origin}</p>
            <h1 class="produit__name">${p.name}</h1>
            <p class="produit__notes">${p.notes}</p>
            <p class="produit__desc">${p.desc}</p>
          </div>
          <div class="produit__buy">
            <fieldset class="weight-selector" aria-label="Poids">
              <legend class="sr-only">Choisir le poids</legend>
              <label class="weight-selector__pill">
                <input type="radio" name="weight" value="250" data-price="${p.prices['250']}" checked />
                <span>250g — ${p.prices['250']} €</span>
              </label>
              <label class="weight-selector__pill">
                <input type="radio" name="weight" value="500" data-price="${p.prices['500']}" />
                <span>500g — ${p.prices['500']} €</span>
              </label>
            </fieldset>
            <div class="produit__add">
              <span class="produit__price" id="produitPrice">${p.prices['250']} €</span>
              <button
                class="btn btn--dark snipcart-add-item"
                id="produitAddBtn"
                data-item-id="${p.id}-250g"
                data-item-name="${p.name} 250g"
                data-item-price="${p.prices['250']}.00"
                data-item-url="/"
                data-item-description="${p.notes}"
                data-item-weight="250">
                Ajouter au panier
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Retour vers nos cafés
  container.querySelector('[data-back]').addEventListener('click', () => navigate('nos-cafes'));

  // Sélecteur de poids
  container.querySelectorAll('.weight-selector__pill input').forEach(radio => {
    radio.addEventListener('change', function () {
      const price  = this.dataset.price;
      const weight = this.value;
      const suffix = weight === '500' ? '500g' : '250g';
      const btn    = container.querySelector('#produitAddBtn');

      container.querySelector('#produitPrice').textContent = `${price} €`;
      btn.dataset.itemPrice  = parseFloat(price).toFixed(2);
      btn.dataset.itemId     = `${p.id}-${suffix}`;
      btn.dataset.itemName   = `${p.name} ${suffix}`;
      btn.dataset.itemWeight = weight;
    });
  });
}

/* ── Construction des cartes produit ─────────────────────── */
function buildProductCard(productId) {
  const p   = PRODUCTS[productId];
  const div = document.createElement('div');
  div.className = 'product-card';
  div.setAttribute('role', 'button');
  div.setAttribute('tabindex', '0');
  div.setAttribute('aria-label', `Voir ${p.name}`);

  div.innerHTML = `
    <div class="product-card__visual">
      <div class="product-card__visual-inner ${p.gradient}"></div>
    </div>
    <div class="product-card__body">
      <p class="product-card__origin">${p.origin}</p>
      <h3 class="product-card__name">${p.name}</h3>
      <p class="product-card__notes">${p.notes}</p>
      <p class="product-card__price">à partir de ${p.prices['250']} €</p>
      <span class="product-card__cta">Découvrir</span>
    </div>
  `;

  const go = () => navigate('produit', productId);
  div.addEventListener('click', go);
  div.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
  return div;
}

/* ── Injection des carousels ─────────────────────────────── */
function initCarousels() {
  const originsTrackIds = ['homeCarouselTrack', 'cafesCarouselTrack'];
  originsTrackIds.forEach(id => {
    const track = document.getElementById(id);
    if (!track) return;
    ['ethiopie', 'colombie', 'guatemala'].forEach(pid => {
      track.appendChild(buildProductCard(pid));
    });
  });

  const sigTrack = document.getElementById('signatureCarouselTrack');
  if (sigTrack) {
    sigTrack.appendChild(buildProductCard('signature'));
  }
}

/* ── Carousel prev/next ──────────────────────────────────── */
function initCarouselControls() {
  document.querySelectorAll('.carousel__btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const trackId = btn.dataset.carousel;
      const track   = document.getElementById(trackId);
      if (!track) return;

      const cardW  = track.firstElementChild?.offsetWidth ?? 0;
      const gap    = 1;
      const amount = cardW + gap;

      if (btn.classList.contains('carousel__btn--prev')) {
        track.scrollBy({ left: -amount, behavior: 'smooth' });
      } else {
        track.scrollBy({ left: amount, behavior: 'smooth' });
      }
    });
  });
}

/* ── Navigation (liens [data-nav]) ───────────────────────── */
function initNavLinks() {
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-nav]');
    if (el) {
      e.preventDefault();
      navigate(el.dataset.nav);
    }
  });
}

/* ── Menu burger ─────────────────────────────────────────── */
let menuOpen = false;

function openMenu() {
  menuOpen = true;
  document.getElementById('navBurger').classList.add('open');
  document.getElementById('navBurger').setAttribute('aria-expanded', 'true');
  document.getElementById('navMenu').classList.add('open');
  document.getElementById('navMenu').setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  if (!menuOpen) return;
  menuOpen = false;
  document.getElementById('navBurger').classList.remove('open');
  document.getElementById('navBurger').setAttribute('aria-expanded', 'false');
  document.getElementById('navMenu').classList.remove('open');
  document.getElementById('navMenu').setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function initMenu() {
  document.getElementById('navBurger').addEventListener('click', () => {
    menuOpen ? closeMenu() : openMenu();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });
}

/* ── Nav scroll ──────────────────────────────────────────── */
function initNavScroll() {
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });
}

/* ── FAQ accordion ───────────────────────────────────────── */
function initFaq() {
  document.querySelectorAll('.faq__question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item     = btn.closest('.faq__item');
      const isOpen   = item.classList.contains('open');

      document.querySelectorAll('.faq__item.open').forEach(open => {
        open.classList.remove('open');
        open.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ── Newsletter Brevo ────────────────────────────────────── */
/*
 * Brevo :
 * 1. Allez sur https://app.brevo.com → Paramètres → Clés API → Créer une clé
 * 2. Contacts → Listes → notez l'ID de votre liste (entier)
 * 3. Remplacez les deux constantes ci-dessous
 */
const BREVO_API_KEY = 'YOUR_BREVO_API_KEY'; // ← remplacer
const BREVO_LIST_ID = 0;                    // ← remplacer (entier)

function initNewsletter() {
  const form     = document.getElementById('newsletterForm');
  const feedback = document.getElementById('nlFeedback');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const input = document.getElementById('nlEmail');
    const btn   = form.querySelector('.newsletter-bar__btn');
    const email = input?.value.trim() ?? '';

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFeedback('Adresse e-mail invalide.', 'error');
      input?.focus();
      return;
    }

    btn.classList.add('loading');
    btn.disabled = true;
    setFeedback('', '');

    try {
      const res = await fetch('https://api.brevo.com/v3/contacts', {
        method: 'POST',
        headers: {
          'accept':       'application/json',
          'content-type': 'application/json',
          'api-key':      BREVO_API_KEY,
        },
        body: JSON.stringify({ email, listIds: [BREVO_LIST_ID], updateEnabled: true }),
      });

      if (res.ok || res.status === 204) {
        setFeedback('Merci ! Bienvenue dans la boucle.', 'success');
        form.reset();
      } else {
        const data = await res.json().catch(() => ({}));
        if (data.code === 'duplicate_parameter') {
          setFeedback('Déjà inscrit(e). À très bientôt !', 'success');
        } else {
          throw new Error(data.message || 'Erreur');
        }
      }
    } catch {
      setFeedback('Une erreur est survenue. Réessayez.', 'error');
    } finally {
      btn.classList.remove('loading');
      btn.disabled = false;
    }
  });

  function setFeedback(msg, type) {
    feedback.textContent = msg;
    feedback.className   = 'newsletter-bar__feedback' + (type ? ' ' + type : '');
  }
}

/* ── Init ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initCarousels();
  initCarouselControls();
  initNavLinks();
  initMenu();
  initNavScroll();
  initFaq();
  initNewsletter();
});
