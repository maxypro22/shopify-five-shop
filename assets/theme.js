/* ==========================================================================
   SHOP FIVE — theme.js
   ========================================================================== */
(function () {
  'use strict';

  const SF = window.shopFive || { routes: {}, strings: {} };

  /* ------------------------------------------------------------------------
     Utilities
     ------------------------------------------------------------------------ */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const overlay = $('[data-page-overlay]');
  let activeDrawer = null;

  function showOverlay() {
    if (!overlay) return;
    overlay.hidden = false;
    requestAnimationFrame(() => overlay.classList.add('is-visible'));
  }

  function hideOverlay() {
    if (!overlay) return;
    overlay.classList.remove('is-visible');
    setTimeout(() => { overlay.hidden = true; }, 350);
  }

  function openDrawer(drawer) {
    if (!drawer) return;
    if (activeDrawer && activeDrawer !== drawer) closeDrawer(activeDrawer);
    activeDrawer = drawer;
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('drawer-open');
    showOverlay();
    const focusable = drawer.querySelector('button, a, input, [tabindex]');
    if (focusable) setTimeout(() => focusable.focus(), 150);
  }

  function closeDrawer(drawer) {
    if (!drawer) return;
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('drawer-open');
    hideOverlay();
    if (activeDrawer === drawer) activeDrawer = null;
  }

  function closeAll() {
    $$('.drawer.is-open').forEach(closeDrawer);
    const search = $('[data-search-overlay]');
    if (search) search.classList.remove('is-open');
    document.body.classList.remove('drawer-open');
    hideOverlay();
  }

  if (overlay) overlay.addEventListener('click', closeAll);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAll();
  });

  /* ------------------------------------------------------------------------
     Color mode toggle (light / dark)
     ------------------------------------------------------------------------ */
  document.addEventListener('click', (e) => {
    const toggle = e.target.closest('[data-theme-toggle]');
    if (!toggle) return;
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('shopfive:color-mode', next); } catch (err) {}
  });

  /* ------------------------------------------------------------------------
     Sticky header — hide on scroll down, reveal on scroll up
     ------------------------------------------------------------------------ */
  const header = $('[data-site-header]');
  if (header) {
    let lastY = window.scrollY;
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        header.classList.toggle('is-scrolled', y > 8);
        if (y > lastY && y > 240 && !document.body.classList.contains('drawer-open')) {
          header.classList.add('is-hidden');
        } else {
          header.classList.remove('is-hidden');
        }
        lastY = y;
        ticking = false;
      });
    }, { passive: true });
  }

  /* ------------------------------------------------------------------------
     Drawer triggers (mobile menu, cart, filters) + search overlay
     ------------------------------------------------------------------------ */
  document.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-drawer-open]');
    if (opener) {
      e.preventDefault();
      openDrawer($(opener.getAttribute('data-drawer-open')));
      return;
    }
    const closer = e.target.closest('[data-drawer-close]');
    if (closer) {
      e.preventDefault();
      closeDrawer(closer.closest('.drawer'));
      return;
    }
    const searchOpen = e.target.closest('[data-search-open]');
    if (searchOpen) {
      e.preventDefault();
      const ov = $('[data-search-overlay]');
      if (ov) {
        ov.classList.add('is-open');
        setTimeout(() => { const inp = ov.querySelector('input'); if (inp) inp.focus(); }, 120);
      }
      return;
    }
    const searchClose = e.target.closest('[data-search-close]');
    if (searchClose) {
      e.preventDefault();
      const ov = $('[data-search-overlay]');
      if (ov) ov.classList.remove('is-open');
    }
  });

  const searchOverlay = $('[data-search-overlay]');
  if (searchOverlay) {
    searchOverlay.addEventListener('click', (e) => {
      if (e.target === searchOverlay) searchOverlay.classList.remove('is-open');
    });
  }

  /* ------------------------------------------------------------------------
     Locale switcher dropdown
     ------------------------------------------------------------------------ */
  $$('[data-locale-switcher]').forEach((root) => {
    const btn = root.querySelector('[data-locale-toggle]');
    const panel = root.querySelector('.locale-switcher__panel');
    if (!btn || !panel) return;
    panel.hidden = true;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      panel.hidden = !panel.hidden;
      btn.setAttribute('aria-expanded', String(!panel.hidden));
    });
    document.addEventListener('click', (e) => {
      if (!root.contains(e.target)) {
        panel.hidden = true;
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  });

  /* ------------------------------------------------------------------------
     Scroll reveal animations
     ------------------------------------------------------------------------ */
  function initReveal(scope = document) {
    const items = $$('.reveal:not(.is-revealed)', scope);
    if (!items.length) return;
    if (!('IntersectionObserver' in window) || document.body.classList.contains('no-animations')) {
      items.forEach((el) => el.classList.add('is-revealed'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach((el) => io.observe(el));
  }
  initReveal();
  document.addEventListener('shopify:section:load', () => initReveal());

  /* ------------------------------------------------------------------------
     Marquees — duplicate content so the loop is seamless
     ------------------------------------------------------------------------ */
  $$('[data-marquee]').forEach((track) => {
    const group = track.querySelector('[data-marquee-group]');
    if (!group) return;
    let clones = Math.max(2, Math.ceil((window.innerWidth * 2) / Math.max(group.offsetWidth, 1)));
    // keep total group count even so the -50% keyframe loops seamlessly
    if ((clones + 1) % 2 !== 0) clones++;
    for (let i = 0; i < clones; i++) {
      const clone = group.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    }
  });

  /* ------------------------------------------------------------------------
     Back to top
     ------------------------------------------------------------------------ */
  const backToTop = $('[data-back-to-top]');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('is-visible', window.scrollY > 600);
    }, { passive: true });
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ------------------------------------------------------------------------
     Cart drawer + AJAX cart
     ------------------------------------------------------------------------ */
  const Cart = {
    drawer: () => $('#CartDrawer'),

    async refresh(openAfter = false) {
      try {
        const res = await fetch(`${window.location.pathname}?sections=cart-drawer`);
        const data = await res.json();
        this.renderDrawer(data['cart-drawer']);
      } catch (err) { /* noop */ }
      if (openAfter) openDrawer(this.drawer());
    },

    renderDrawer(html) {
      if (!html) return;
      const drawer = this.drawer();
      if (!drawer) return;
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const fresh = doc.querySelector('#CartDrawer');
      if (fresh) {
        drawer.innerHTML = fresh.innerHTML;
        const wasOpen = drawer.classList.contains('is-open');
        if (wasOpen) drawer.classList.add('is-open');
      }
      const freshCount = doc.querySelector('[data-cart-count]');
      if (freshCount) this.updateBubbles(freshCount.textContent.trim());
      drawer.classList.remove('is-loading');
    },

    updateBubbles(count) {
      $$('[data-cart-count]').forEach((el) => {
        el.textContent = count;
        el.dataset.count = count;
        el.classList.remove('is-bumping');
        void el.offsetWidth;
        el.classList.add('is-bumping');
      });
    },

    async add(formData, button) {
      if (button) button.classList.add('is-loading');
      formData.append('sections', 'cart-drawer');
      formData.append('sections_url', window.location.pathname);
      try {
        const res = await fetch(SF.routes.cartAdd + '.js', {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: formData
        });
        const data = await res.json();
        if (!res.ok) {
          this.notify(data.description || data.message || SF.strings.cartError, 'error', button);
          return;
        }
        if (data.sections && data.sections['cart-drawer']) {
          this.renderDrawer(data.sections['cart-drawer']);
        } else {
          await this.refresh();
        }
        openDrawer(this.drawer());
      } catch (err) {
        this.notify(SF.strings.cartError, 'error', button);
      } finally {
        if (button) button.classList.remove('is-loading');
      }
    },

    async change(line, quantity) {
      const drawer = this.drawer();
      if (drawer) drawer.classList.add('is-loading');
      try {
        const res = await fetch(SF.routes.cartChange + '.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            line: Number(line),
            quantity: Number(quantity),
            sections: 'cart-drawer',
            sections_url: window.location.pathname
          })
        });
        const data = await res.json();
        if (data.sections && data.sections['cart-drawer']) {
          this.renderDrawer(data.sections['cart-drawer']);
        }
        // If we are on the cart page, reload so the page table stays in sync
        if (document.body.classList.contains('template-cart')) {
          window.location.reload();
        }
      } catch (err) {
        if (drawer) drawer.classList.remove('is-loading');
      }
    },

    notify(message, type, near) {
      let el = $('.cart-toast');
      if (!el) {
        el = document.createElement('div');
        el.className = 'cart-toast';
        el.setAttribute('role', 'alert');
        Object.assign(el.style, {
          position: 'fixed', insetBlockEnd: '2.4rem', insetInlineStart: '50%',
          transform: 'translateX(-50%)', zIndex: 120, padding: '1.4rem 2.4rem',
          borderRadius: '100px', fontSize: '1.4rem', fontWeight: 700,
          boxShadow: 'var(--shadow-lg)', maxWidth: '90vw', textAlign: 'center'
        });
        document.body.appendChild(el);
      }
      el.style.background = type === 'error' ? 'var(--color-danger)' : 'var(--color-success)';
      el.style.color = '#fff';
      el.textContent = message;
      el.hidden = false;
      clearTimeout(el._t);
      el._t = setTimeout(() => { el.hidden = true; }, 3500);
    }
  };

  // Product form submissions (product page + quick add)
  document.addEventListener('submit', (e) => {
    const form = e.target.closest('form[data-product-form]');
    if (!form) return;
    e.preventDefault();
    const button = form.querySelector('[type="submit"]');
    Cart.add(new FormData(form), button);
  });

  // Cart line quantity +/- and remove (event delegation survives re-renders)
  document.addEventListener('click', (e) => {
    const qtyBtn = e.target.closest('[data-quantity-change]');
    if (qtyBtn) {
      const wrap = qtyBtn.closest('.quantity');
      const input = wrap && wrap.querySelector('.quantity__input');
      if (!input) return;
      const delta = qtyBtn.dataset.quantityChange === 'up' ? 1 : -1;
      const next = Math.max(Number(input.min || 0), Number(input.value || 0) + delta);
      input.value = next;
      const line = input.dataset.line;
      if (line) Cart.change(line, next);
      return;
    }
    const removeBtn = e.target.closest('[data-cart-remove]');
    if (removeBtn) {
      e.preventDefault();
      Cart.change(removeBtn.dataset.cartRemove, 0);
    }
  });

  document.addEventListener('change', (e) => {
    const input = e.target.closest('.quantity__input[data-line]');
    if (input) Cart.change(input.dataset.line, input.value);
  });

  /* ------------------------------------------------------------------------
     Variant picker (product page)
     ------------------------------------------------------------------------ */
  $$('[data-variant-picker]').forEach((picker) => {
    const productJsonEl = picker.querySelector('[data-product-json]');
    if (!productJsonEl) return;
    let product;
    try { product = JSON.parse(productJsonEl.textContent); } catch (err) { return; }

    const form = document.querySelector(`form[data-product-form][data-product-id="${picker.dataset.productId}"]`);
    const idInput = form && form.querySelector('input[name="id"]');
    const priceEl = document.querySelector('[data-product-price]');
    const buyBtn = form && form.querySelector('[data-add-to-cart]');
    const buyBtnText = buyBtn && buyBtn.querySelector('[data-add-to-cart-text]');

    function formatMoney(cents) {
      const format = SF.moneyFormat || '{{amount}}';
      const amount = (cents / 100).toFixed(2);
      return format.replace(/\{\{\s*amount[^}]*\}\}/, amount);
    }

    function currentOptions() {
      return $$('.variant-picker__options', picker).map((group) => {
        const checked = group.querySelector('input:checked');
        return checked ? checked.value : null;
      });
    }

    function findVariant(options) {
      return product.variants.find((v) => v.options.every((opt, i) => opt === options[i]));
    }

    function update() {
      const variant = findVariant(currentOptions());
      if (!variant) {
        if (buyBtn) {
          buyBtn.disabled = true;
          if (buyBtnText) buyBtnText.textContent = SF.strings.unavailable;
        }
        return;
      }
      if (idInput) idInput.value = variant.id;
      if (priceEl) {
        let html = '';
        if (variant.compare_at_price && variant.compare_at_price > variant.price) {
          html = `<s class="price__compare">${formatMoney(variant.compare_at_price)}</s>` +
                 `<span class="price__current is-sale">${formatMoney(variant.price)}</span>`;
        } else {
          html = `<span class="price__current">${formatMoney(variant.price)}</span>`;
        }
        priceEl.innerHTML = html;
      }
      if (buyBtn) {
        buyBtn.disabled = !variant.available;
        if (buyBtnText) {
          buyBtnText.textContent = variant.available ? SF.strings.addToCart : SF.strings.soldOut;
        }
      }
      if (variant.featured_media) {
        const thumb = document.querySelector(`[data-media-id="${variant.featured_media.id}"]`);
        if (thumb) thumb.click();
      }
      const url = new URL(window.location.href);
      url.searchParams.set('variant', variant.id);
      window.history.replaceState({}, '', url.toString());
    }

    picker.addEventListener('change', update);
  });

  /* ------------------------------------------------------------------------
     Product gallery
     ------------------------------------------------------------------------ */
  $$('[data-product-gallery]').forEach((gallery) => {
    const mainImg = gallery.querySelector('[data-gallery-main] img');
    const thumbs = $$('[data-gallery-thumb]', gallery);
    if (!mainImg || !thumbs.length) return;
    thumbs.forEach((thumb) => {
      thumb.addEventListener('click', () => {
        const src = thumb.dataset.fullSrc;
        if (!src || mainImg.getAttribute('src') === src) return;
        mainImg.style.opacity = '0';
        setTimeout(() => {
          mainImg.src = src;
          if (thumb.dataset.fullSrcset) mainImg.srcset = thumb.dataset.fullSrcset;
          mainImg.alt = thumb.querySelector('img') ? thumb.querySelector('img').alt : '';
          mainImg.onload = () => { mainImg.style.opacity = '1'; };
        }, 160);
        thumbs.forEach((t) => t.classList.remove('is-active'));
        thumb.classList.add('is-active');
      });
    });
  });

  /* ------------------------------------------------------------------------
     Quantity selector on product page (no data-line => no cart call)
     ------------------------------------------------------------------------ */
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-qty-static]');
    if (!btn) return;
    const wrap = btn.closest('.quantity');
    const input = wrap && wrap.querySelector('.quantity__input');
    if (!input) return;
    const delta = btn.dataset.qtyStatic === 'up' ? 1 : -1;
    input.value = Math.max(1, Number(input.value || 1) + delta);
  });

  /* ------------------------------------------------------------------------
     Countdown timers
     ------------------------------------------------------------------------ */
  $$('[data-countdown]').forEach((el) => {
    const end = new Date(el.dataset.countdown).getTime();
    if (isNaN(end)) return;
    const fields = {
      d: el.querySelector('[data-cd-days]'),
      h: el.querySelector('[data-cd-hours]'),
      m: el.querySelector('[data-cd-minutes]'),
      s: el.querySelector('[data-cd-seconds]')
    };
    const pad = (n) => String(n).padStart(2, '0');
    function tick() {
      const diff = end - Date.now();
      if (diff <= 0) {
        el.classList.add('is-finished');
        Object.values(fields).forEach((f) => { if (f) f.textContent = '00'; });
        clearInterval(timer);
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      if (fields.d) fields.d.textContent = pad(d);
      if (fields.h) fields.h.textContent = pad(h);
      if (fields.m) fields.m.textContent = pad(m);
      if (fields.s) fields.s.textContent = pad(s);
    }
    tick();
    const timer = setInterval(tick, 1000);
  });

  /* ------------------------------------------------------------------------
     Horizontal sliders (testimonials, featured) prev/next buttons
     ------------------------------------------------------------------------ */
  $$('[data-slider]').forEach((root) => {
    const track = root.querySelector('[data-slider-track]');
    if (!track) return;
    const rtl = document.documentElement.dir === 'rtl';
    root.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-slider-prev], [data-slider-next]');
      if (!btn) return;
      const card = track.firstElementChild;
      const step = card ? card.getBoundingClientRect().width + 20 : 320;
      let dir = btn.hasAttribute('data-slider-next') ? 1 : -1;
      if (rtl) dir *= -1;
      track.scrollBy({ left: step * dir, behavior: 'smooth' });
    });
  });

  /* ------------------------------------------------------------------------
     Facet filters — auto submit on change
     ------------------------------------------------------------------------ */
  $$('form[data-facet-form]').forEach((form) => {
    let debounce;
    form.addEventListener('change', (e) => {
      if (e.target.matches('input[type="number"]')) {
        clearTimeout(debounce);
        debounce = setTimeout(() => form.submit(), 700);
      } else {
        form.submit();
      }
    });
  });

  const sortSelect = $('[data-sort-select]');
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      const url = new URL(window.location.href);
      url.searchParams.set('sort_by', sortSelect.value);
      url.searchParams.delete('page');
      window.location.href = url.toString();
    });
  }

  /* ------------------------------------------------------------------------
     Related products (Shopify recommendations API)
     ------------------------------------------------------------------------ */
  $$('[data-related-products]').forEach(async (el) => {
    const root = (window.Shopify && window.Shopify.routes && window.Shopify.routes.root) || '/';
    const url = `${root}recommendations/products?product_id=${el.dataset.productId}&limit=${el.dataset.limit || 4}&section_id=${el.dataset.sectionId}`;
    try {
      const res = await fetch(url);
      if (!res.ok) return;
      const text = await res.text();
      const doc = new DOMParser().parseFromString(text, 'text/html');
      const inner = doc.querySelector('[data-related-products]');
      if (inner && inner.innerHTML.trim()) {
        el.innerHTML = inner.innerHTML;
        initReveal(el);
      } else {
        const section = el.closest('.related-products');
        if (section) section.hidden = true;
      }
    } catch (err) {
      const section = el.closest('.related-products');
      if (section) section.hidden = true;
    }
  });
})();
