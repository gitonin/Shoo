/* =============================================================
   SHOO Coffee — Main JS
============================================================= */

/* ── Nav: scroll behaviour ───────────────────────────────── */
(function () {
  const nav = document.getElementById('nav');
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


/* ── Nav: mobile menu ────────────────────────────────────── */
(function () {
  const burger  = document.getElementById('navBurger');
  const overlay = document.getElementById('navMenu');
  if (!burger || !overlay) return;

  const open = () => {
    burger.classList.add('open');
    burger.setAttribute('aria-expanded', 'true');
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  burger.addEventListener('click', () => {
    burger.classList.contains('open') ? close() : open();
  });

  overlay.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', close);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
  });
})();


/* ── Nav: smooth scroll for anchor links ─────────────────── */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navHeight = document.getElementById('nav')?.offsetHeight ?? 64;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ── Weight selector: update price + Snipcart data attrs ─── */
(function () {
  document.querySelectorAll('.weight-selector').forEach(selector => {
    const card    = selector.closest('.product-card');
    if (!card) return;
    const priceEl = card.querySelector('.product-card__price');
    const btn     = card.querySelector('.snipcart-add-item');

    selector.querySelectorAll('input[type="radio"]').forEach(radio => {
      radio.addEventListener('change', function () {
        const price  = this.dataset.price;
        const weight = this.value;
        const suffix = weight === '500' ? '500g' : '250g';

        if (priceEl) priceEl.textContent = price + ' €';

        if (btn) {
          const baseName = btn.dataset.itemName?.replace(/ (250g|500g)$/, '') ?? '';
          const baseId   = btn.dataset.itemId?.replace(/-(250g|500g)$/, '') ?? '';
          btn.dataset.itemPrice = parseFloat(price).toFixed(2);
          btn.dataset.itemName  = `${baseName} ${suffix}`;
          btn.dataset.itemId    = `${baseId}-${suffix}`;
          btn.dataset.itemWeight = weight;
        }
      });
    });
  });
})();


/* ── Scroll-reveal via IntersectionObserver ─────────────── */
(function () {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger siblings inside the same parent
          const siblings = entry.target.parentElement.querySelectorAll('.reveal:not(.visible)');
          siblings.forEach((sibling, index) => {
            if (sibling === entry.target) {
              setTimeout(() => sibling.classList.add('visible'), index * 80);
            }
          });
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  items.forEach(el => observer.observe(el));
})();


/* ── Newsletter: Brevo API subscription ──────────────────── */
(function () {
  const form     = document.getElementById('newsletterForm');
  const feedback = document.getElementById('newsletterFeedback');
  if (!form || !feedback) return;

  /*
   * Brevo configuration:
   * 1. Go to https://app.brevo.com → Settings → API Keys → Create a key
   * 2. Go to Contacts → Lists → create or pick a list, note the list ID (integer)
   * 3. Replace the two constants below:
   */
  const BREVO_API_KEY = 'YOUR_BREVO_API_KEY';  // ← replace
  const BREVO_LIST_ID = 0;                      // ← replace with your list ID (integer)

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const emailInput = form.querySelector('#newsletterEmail');
    const submitBtn  = form.querySelector('.newsletter__submit');
    const email      = emailInput?.value.trim() ?? '';

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFeedback('Veuillez entrer une adresse e-mail valide.', 'error');
      emailInput?.focus();
      return;
    }

    submitBtn?.classList.add('loading');
    submitBtn.disabled = true;
    setFeedback('', '');

    try {
      const res = await fetch('https://api.brevo.com/v3/contacts', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'api-key': BREVO_API_KEY,
        },
        body: JSON.stringify({
          email,
          listIds: [BREVO_LIST_ID],
          updateEnabled: true,
        }),
      });

      if (res.ok || res.status === 204) {
        setFeedback('Merci ! Vous êtes maintenant abonné(e).', 'success');
        form.reset();
      } else {
        const data = await res.json().catch(() => ({}));
        if (data.code === 'duplicate_parameter') {
          setFeedback('Cette adresse est déjà inscrite. À bientôt !', 'success');
        } else {
          throw new Error(data.message || 'Erreur inconnue');
        }
      }
    } catch (err) {
      console.error('[Newsletter]', err);
      setFeedback('Une erreur est survenue. Réessayez dans quelques instants.', 'error');
    } finally {
      submitBtn?.classList.remove('loading');
      submitBtn.disabled = false;
    }
  });

  function setFeedback(message, type) {
    feedback.textContent = message;
    feedback.className   = 'newsletter__feedback' + (type ? ' ' + type : '');
  }
})();
