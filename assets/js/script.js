document.addEventListener('DOMContentLoaded', () => {
  // Hamburger Mobile Menu Toggle
  const hamburgerBtn = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu-placeholder');

  if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileMenu.classList.toggle('hidden');
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

  // Swiper Initialization
  if (typeof Swiper !== 'undefined' && document.querySelector('.main-slider')) {
    new Swiper('.main-slider', {
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
    });
  }

  // Quantity Selector for Product & Cart
  const qtyBtns = document.querySelectorAll('.qty-btn');
  qtyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.parentElement.querySelector('input[type="number"]');
      if (!input) return;
      let val = parseInt(input.value) || 1;
      if (btn.classList.contains('qty-minus') || btn.innerText.trim() === '-') {
        if (val > 1) input.value = val - 1;
      } else {
        input.value = val + 1;
      }
    });
  });

  // Gallery Thumbnail Switcher
  const mainImage = document.getElementById('main-product-image');
  const thumbnails = document.querySelectorAll('.product-thumb');
  if (mainImage && thumbnails.length) {
    thumbnails.forEach(thumb => {
      thumb.addEventListener('click', () => {
        mainImage.src = thumb.src;
        thumbnails.forEach(t => t.classList.remove('border-primary'));
        thumb.classList.add('border-primary');
      });
    });
  }
});
