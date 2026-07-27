document.addEventListener('DOMContentLoaded', () => {
  // Hamburger Mobile Menu Toggle
  const hamburgerBtn = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu-placeholder');

  if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileMenu.classList.toggle('hidden');
      hamburgerBtn.setAttribute(
        'aria-expanded',
        mobileMenu.classList.contains('hidden') ? 'false' : 'true'
      );
    });

    document.addEventListener('click', (e) => {
      if (
        !mobileMenu.classList.contains('hidden') &&
        !mobileMenu.contains(e.target) &&
        !hamburgerBtn.contains(e.target)
      ) {
        mobileMenu.classList.add('hidden');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Search Toggle
  const searchIcon = document.getElementById('search-icon');
  const searchField = document.getElementById('search-field');

  if (searchIcon && searchField) {
    searchIcon.addEventListener('click', (e) => {
      e.stopPropagation();
      searchField.classList.toggle('hidden');
      if (!searchField.classList.contains('hidden')) {
        const input = searchField.querySelector('input');
        if (input) input.focus();
      }
    });

    document.addEventListener('click', (e) => {
      if (!searchField.contains(e.target) && !searchIcon.contains(e.target)) {
        searchField.classList.add('hidden');
      }
    });
  }

  // Swiper Initialization (Swiper 11 uses .swiper)
  if (typeof Swiper !== 'undefined' && document.querySelector('.main-slider')) {
    new Swiper('.main-slider', {
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      navigation: {
        nextEl: '#product-slider .swiper-button-next',
        prevEl: '#product-slider .swiper-button-prev',
      },
      pagination: {
        el: '#product-slider .swiper-pagination',
        clickable: true,
      },
    });
  }

  // Product page quantity (+ / -)
  const qtyInput = document.getElementById('quantity');
  const decreaseBtn = document.getElementById('decrease');
  const increaseBtn = document.getElementById('increase');

  if (qtyInput && decreaseBtn && increaseBtn) {
    const syncQtyState = () => {
      const val = parseInt(qtyInput.value, 10) || 1;
      qtyInput.value = Math.max(1, val);
      decreaseBtn.disabled = qtyInput.value <= 1;
    };

    decreaseBtn.addEventListener('click', () => {
      qtyInput.value = Math.max(1, (parseInt(qtyInput.value, 10) || 1) - 1);
      syncQtyState();
    });

    increaseBtn.addEventListener('click', () => {
      qtyInput.value = (parseInt(qtyInput.value, 10) || 1) + 1;
      syncQtyState();
    });

    syncQtyState();
  }

  // Generic quantity buttons (.qty-btn)
  document.querySelectorAll('.qty-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const input = btn.parentElement.querySelector('input[type="number"]');
      if (!input) return;
      let val = parseInt(input.value, 10) || 1;
      if (btn.classList.contains('qty-minus') || btn.textContent.trim() === '-') {
        if (val > 1) input.value = val - 1;
      } else {
        input.value = val + 1;
      }
    });
  });

  // Cart quantity controls
  const cartItems = document.getElementById('cart-items');
  if (cartItems) {
    const parsePrice = (text) => {
      const n = parseFloat(String(text).replace(/[^0-9.]/g, ''));
      return Number.isFinite(n) ? n : 0;
    };

    const formatMoney = (n) =>
      `$${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

    const updateCartTotals = () => {
      let subtotal = 0;
      cartItems.querySelectorAll('tr').forEach((row) => {
        const priceCell = row.children[1];
        const qtyEl = row.querySelector('.quantity');
        const totalCell = row.children[3];
        if (!priceCell || !qtyEl || !totalCell) return;
        const price = parsePrice(priceCell.textContent);
        const qty = parseInt(qtyEl.textContent, 10) || 1;
        const lineTotal = price * qty;
        totalCell.textContent = formatMoney(lineTotal);
        subtotal += lineTotal;
      });

      const summary = document.querySelector('#cart-summary, .cart-summary');
      if (summary) {
        const subtotalEl = summary.querySelector('[data-cart-subtotal]');
        const taxEl = summary.querySelector('[data-cart-tax]');
        const totalEl = summary.querySelector('[data-cart-total]');
        const tax = Math.round(subtotal * 0.08);
        if (subtotalEl) subtotalEl.textContent = formatMoney(subtotal);
        if (taxEl) taxEl.textContent = formatMoney(tax);
        if (totalEl) totalEl.textContent = formatMoney(subtotal + tax);
      }
    };

    cartItems.addEventListener('click', (e) => {
      const btn = e.target.closest('.cart-decrement, .cart-increment');
      if (!btn) return;
      const wrap = btn.parentElement;
      const qtyEl = wrap.querySelector('.quantity');
      if (!qtyEl) return;
      let qty = parseInt(qtyEl.textContent, 10) || 1;
      if (btn.classList.contains('cart-decrement')) {
        qty = Math.max(1, qty - 1);
      } else {
        qty += 1;
      }
      qtyEl.textContent = String(qty);
      updateCartTotals();
    });

    updateCartTotals();
  }

  // Gallery Thumbnail Switcher
  const mainImage =
    document.getElementById('main-product-image') ||
    document.getElementById('main-image');
  const thumbnails = document.querySelectorAll('.product-thumb, [onclick*="changeImage"]');

  if (mainImage && thumbnails.length) {
    thumbnails.forEach((thumb) => {
      thumb.addEventListener('click', () => {
        const full = thumb.getAttribute('data-full') || thumb.src;
        mainImage.src = full;
        thumbnails.forEach((t) => t.classList.remove('ring-2', 'ring-primary', 'border-primary'));
        thumb.classList.add('ring-2', 'ring-primary');
      });
    });
  }

  // Product detail tabs
  const tabs = document.querySelectorAll('[role="tab"].tab');
  if (tabs.length) {
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const panelId = tab.getAttribute('aria-controls');
        tabs.forEach((t) => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        document.querySelectorAll('.tab-content').forEach((panel) => {
          panel.classList.add('hidden');
        });
        const panel = panelId ? document.getElementById(panelId) : null;
        if (panel) panel.classList.remove('hidden');
      });
    });
  }
});

// Used by inline onclick handlers on the product gallery
function changeImage(el) {
  const mainImage = document.getElementById('main-image');
  if (!mainImage || !el) return;
  mainImage.src = el.getAttribute('data-full') || el.src;
  document.querySelectorAll('[onclick*="changeImage"]').forEach((thumb) => {
    thumb.classList.remove('ring-2', 'ring-primary');
  });
  el.classList.add('ring-2', 'ring-primary');
}
