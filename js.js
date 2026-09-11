/* ============================================================
   EXPLORE ARCHERY FOUNDATION — SITE SCRIPT
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Mobile nav toggle ---------- */
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('mainNav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    nav.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Sticky header solid-on-scroll ---------- */
  var header = document.getElementById('siteHeader');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-solid', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Animated stat counters ---------- */
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    var animateCount = function (el) {
      var target = parseInt(el.getAttribute('data-count'), 10) || 0;
      if (target === 0) { el.textContent = '0'; return; }
      var duration = 1400;
      var start = null;
      var step = function (ts) {
        if (!start) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target).toLocaleString();
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target.toLocaleString() + '+';
      };
      requestAnimationFrame(step);
    };
    if ('IntersectionObserver' in window) {
      var countIo = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            countIo.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      counters.forEach(function (el) { countIo.observe(el); });
    } else {
      counters.forEach(animateCount);
    }
  }

  /* ---------- Get Involved: gift tier + amount pill selection ---------- */
  var giftCards = document.querySelectorAll('.gift-card[data-amount]');
  var amountPills = document.querySelectorAll('.amount-pill');
  var customInput = document.getElementById('customAmount');
  var selectedDisplay = document.getElementById('selectedAmountDisplay');

  function selectAmount(value, label) {
    amountPills.forEach(function (p) {
      p.classList.toggle('active', p.getAttribute('data-value') === String(value));
    });
    giftCards.forEach(function (c) {
      c.classList.toggle('selected', c.getAttribute('data-amount') === String(value));
    });
    if (selectedDisplay) {
      selectedDisplay.textContent = label || ('KSh ' + Number(value).toLocaleString());
    }
  }

  giftCards.forEach(function (card) {
    card.addEventListener('click', function () {
      var amount = card.getAttribute('data-amount');
      selectAmount(amount);
      if (customInput) customInput.value = '';
    });
  });

  amountPills.forEach(function (pill) {
    pill.addEventListener('click', function () {
      var value = pill.getAttribute('data-value');
      if (value === 'other') {
        amountPills.forEach(function (p) { p.classList.remove('active'); });
        pill.classList.add('active');
        if (customInput) customInput.focus();
        if (selectedDisplay) selectedDisplay.textContent = 'Custom amount';
      } else {
        selectAmount(value);
        if (customInput) customInput.value = '';
      }
    });
  });

  if (customInput) {
    customInput.addEventListener('input', function () {
      if (customInput.value) {
        amountPills.forEach(function (p) { p.classList.remove('active'); });
        giftCards.forEach(function (c) { c.classList.remove('selected'); });
        var otherPill = document.querySelector('.amount-pill[data-value="other"]');
        if (otherPill) otherPill.classList.add('active');
        if (selectedDisplay) selectedDisplay.textContent = 'KSh ' + Number(customInput.value).toLocaleString();
      }
    });
  }

  var giveForm = document.getElementById('giveForm');
  if (giveForm) {
    giveForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var amount = selectedDisplay ? selectedDisplay.textContent : 'your gift';
      var confirmBox = document.getElementById('giveConfirm');
      if (confirmBox) {
        confirmBox.textContent = 'Thank you — you selected ' + amount + '. Our team will follow up with secure payment details shortly.';
        confirmBox.classList.add('show');
      }
    });
  }

  /* ---------- Contact form (client-side demo submit) ---------- */
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var successBox = document.getElementById('contactSuccess');
      if (successBox) {
        successBox.classList.add('show');
      }
      contactForm.reset();
    });
  }

});