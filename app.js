/* ==========================================================================
   TWOZAYZ - Interactive Application Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Water Splash Canvas Animation
  initSplashCanvas();

  // 2. Mobile Menu Navigation
  initMobileMenu();

  // 3. Before & After Interactive Slider
  initBeforeAfterSlider();

  // 4. Estimate Selector & Form Handling
  initQuoteForm();

  // 5. Live Customer Reviews & Smart Reputation Shield
  initLiveReviews();

  // 6. General Interactivity & Year
  document.getElementById('currentYear').textContent = new Date().getFullYear();
});

/* ==========================================================================
   1. Canvas Hydro Splash Animation
   ========================================================================== */
function initSplashCanvas() {
  const canvas = document.getElementById('splashCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Droplet particle system
  const particles = [];
  const particleCount = 40;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 3 + 1,
      speedY: -(Math.random() * 1.5 + 0.5),
      speedX: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.5 + 0.2,
      pulse: Math.random() * 0.05
    });
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.y += p.speedY;
      p.x += p.speedX;

      if (p.y < -10) {
        p.y = height + 10;
        p.x = Math.random() * width;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 210, 255, ${p.opacity})`;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#00d2ff';
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. Mobile Menu Navigation
   ========================================================================== */
function initMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }
}

/* ==========================================================================
   3. Before & After Interactive Slider
   ========================================================================== */
const transformationData = {
  truck: {
    before: 'truck-before.jpg',
    after: 'truck-after.jpg',
    altBefore: 'Dodge Ram 1500 truck before exterior wash covered in road grime and mud splatter',
    altAfter: 'Dodge Ram 1500 truck after TWOZAYZ full exterior detail with mirror gloss silver finish'
  },
  wheel: {
    before: 'wheel-before.jpg',
    after: 'wheel-after.jpg',
    altBefore: 'Truck chrome wheel before detailing with brake dust and faded tire rubber',
    altAfter: 'Truck wheel after TWOZAYZ detail with brilliant chrome shine and deep wet tire dressing'
  },
  mirror: {
    before: 'mirror-before.jpg',
    after: 'mirror-after.jpg',
    altBefore: 'Truck towing mirror glass with heavy hard water spots and mineral etching',
    altAfter: 'Crystal clear truck mirror glass after TWOZAYZ water spot removal treatment'
  },
  driveway: {
    before: 'driveway-before.jpg',
    after: 'driveway-after.jpg',
    altBefore: 'Concrete driveway before pressure washing with black mildew and grime',
    altAfter: 'Spotless clean driveway after TWOZAYZ pressure washing'
  },
  auto: {
    before: 'auto-before.jpg',
    after: 'auto-after.jpg',
    altBefore: 'SUV tire and wheel before detailing with brake dust and road grime',
    altAfter: 'Mirror gloss black SUV paint with wet tire shine and spotless black rim'
  },
  lawn: {
    before: 'lawn-before.jpg',
    after: 'lawn-after.jpg',
    altBefore: 'Overgrown lawn with weeds creeping over concrete sidewalk',
    altAfter: 'Precision manicured green lawn with razor sharp vertical edging'
  }
};

function initBeforeAfterSlider() {
  const slider = document.getElementById('baSlider');
  const beforeWrapper = document.getElementById('baBeforeImage');
  const beforeImg = document.getElementById('baBeforeImg');
  const afterImg = document.getElementById('baAfterImg');
  const handle = document.getElementById('baHandle');
  const tabBtns = document.querySelectorAll('.tab-btn');

  if (!slider || !beforeWrapper || !beforeImg || !afterImg || !handle) return;

  function syncImageWidth() {
    if (slider && beforeImg) {
      beforeImg.style.width = `${slider.offsetWidth}px`;
    }
  }

  // Set initial images
  updateSliderData('truck');
  syncImageWidth();
  window.addEventListener('resize', syncImageWidth);

  const categories = ['truck', 'wheel', 'mirror', 'driveway', 'auto', 'lawn'];
  let currentCategoryIndex = 0;
  let isDragging = false;
  let isHovered = false;
  let autoGlideActive = true;
  let autoCycleTimer = null;
  let animationFrameId = null;
  let glidePhase = 0;
  let lastTimestamp = 0;

  function applyPosition(percent) {
    if (percent < 0) percent = 0;
    if (percent > 100) percent = 100;
    beforeWrapper.style.width = `${percent}%`;
    handle.style.left = `${percent}%`;
  }

  function setSliderPosition(x) {
    const rect = slider.getBoundingClientRect();
    let position = ((x - rect.left) / rect.width) * 100;
    applyPosition(position);
  }

  function switchCategory(index, resetHandle = true) {
    currentCategoryIndex = index;
    const cat = categories[currentCategoryIndex];
    tabBtns.forEach(b => {
      if (b.dataset.tab === cat) {
        b.classList.add('active');
        if (typeof b.scrollIntoView === 'function') {
          b.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      } else {
        b.classList.remove('active');
      }
    });
    updateSliderData(cat);
    if (resetHandle) {
      glidePhase = 0;
      applyPosition(50);
    }
  }

  function advanceNextCategory() {
    currentCategoryIndex = (currentCategoryIndex + 1) % categories.length;
    switchCategory(currentCategoryIndex, true);
  }

  // Time-synced sinusoidal auto-glide (exact 9.0s cycle per category)
  function stepAutoGlide(timestamp) {
    if (!lastTimestamp) lastTimestamp = timestamp;
    const dt = Math.min(timestamp - lastTimestamp, 100);
    lastTimestamp = timestamp;

    if (autoGlideActive && !isDragging && !isHovered) {
      glidePhase += (2 * Math.PI / 9000) * dt; // 9.0 seconds per full cycle
      
      if (glidePhase >= 2 * Math.PI) {
        glidePhase = 0;
        advanceNextCategory();
      }

      const sinVal = Math.sin(glidePhase);
      const position = 50 + sinVal * 36; // Sweeps smoothly between 14% and 86%
      applyPosition(position);
    }

    animationFrameId = requestAnimationFrame(stepAutoGlide);
  }

  function pauseAutoGlide() {
    autoGlideActive = false;
    if (autoCycleTimer) clearTimeout(autoCycleTimer);
  }

  function resumeAutoGlideAfterDelay(delayMs = 9000) {
    if (autoCycleTimer) clearTimeout(autoCycleTimer);
    autoCycleTimer = setTimeout(() => {
      lastTimestamp = performance.now();
      const currentPos = parseFloat(handle.style.left) || 50;
      const clamped = Math.max(14, Math.min(86, currentPos));
      const normalized = (clamped - 50) / 36;
      glidePhase = Math.asin(Math.max(-1, Math.min(1, normalized)));
      autoGlideActive = true;
    }, delayMs);
  }

  // Event Listeners for dragging
  slider.addEventListener('mousedown', (e) => {
    pauseAutoGlide();
    isDragging = true;
    setSliderPosition(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      resumeAutoGlideAfterDelay(9000);
    }
  });

  window.addEventListener('mousemove', (e) => {
    if (isDragging) {
      pauseAutoGlide();
      setSliderPosition(e.clientX);
    }
  });

  // Touch support for mobile
  slider.addEventListener('touchstart', (e) => {
    pauseAutoGlide();
    isDragging = true;
    setSliderPosition(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchend', () => {
    if (isDragging) {
      isDragging = false;
      resumeAutoGlideAfterDelay(9000);
    }
  });

  window.addEventListener('touchmove', (e) => {
    if (isDragging) {
      pauseAutoGlide();
      setSliderPosition(e.touches[0].clientX);
    }
  }, { passive: true });

  // Hover detection for desktop
  slider.addEventListener('mouseenter', () => {
    isHovered = true;
  });

  slider.addEventListener('mouseleave', () => {
    isHovered = false;
    if (!isDragging) {
      resumeAutoGlideAfterDelay(2000);
    }
  });

  // Start auto-glide when section is visible
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!animationFrameId) {
            lastTimestamp = performance.now();
            animationFrameId = requestAnimationFrame(stepAutoGlide);
          }
        } else {
          if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
          }
        }
      });
    }, { threshold: 0.15 });
    observer.observe(slider);
  } else {
    lastTimestamp = performance.now();
    animationFrameId = requestAnimationFrame(stepAutoGlide);
  }

  // Tab button manual click handler
  tabBtns.forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      pauseAutoGlide();
      switchCategory(idx, false);
      resumeAutoGlideAfterDelay(10000); // Keep user's chosen tab active for 10s before resuming auto-tour
    });
  });

  function updateSliderData(category) {
    const data = transformationData[category] || transformationData.truck;
    beforeImg.src = data.before;
    afterImg.src = data.after;
    beforeImg.alt = data.altBefore;
    afterImg.alt = data.altAfter;
    syncImageWidth();
  }
}

/* ==========================================================================
   4. Estimate Selector & Form Handling
   ========================================================================== */
function initQuoteForm() {
  const selectorCards = document.querySelectorAll('.selector-card');
  const quoteForm = document.getElementById('quoteForm');
  const modal = document.getElementById('confirmModal');
  const modalClose = document.getElementById('modalClose');
  const modalOkBtn = document.getElementById('modalOkBtn');
  const serviceScope = document.getElementById('serviceScope');

  // Service Selector Cards toggle
  selectorCards.forEach(card => {
    card.addEventListener('click', () => {
      selectorCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');

      const selectedValue = card.dataset.value;
      if (serviceScope) {
        if (selectedValue === 'Pressure Washing') {
          serviceScope.value = 'Driveway & Sidewalk';
        } else if (selectedValue === 'Car Detailing') {
          serviceScope.value = 'Auto Interior Exterior';
        } else if (selectedValue === 'Lawn Care') {
          serviceScope.value = 'Lawn Mow & Edge';
        } else {
          serviceScope.value = 'Full Package';
        }
      }
    });
  });

  // "Request Service" buttons in service cards
  document.querySelectorAll('.service-card-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const serviceType = btn.dataset.service;
      if (serviceType === 'pressure') {
        selectCardByValue('Pressure Washing');
      } else if (serviceType === 'detail') {
        selectCardByValue('Car Detailing');
      } else if (serviceType === 'lawn') {
        selectCardByValue('Lawn Care');
      }
    });
  });

  function selectCardByValue(val) {
    selectorCards.forEach(c => {
      if (c.dataset.value === val) {
        c.click();
      }
    });
  }

  // Form submission handler
  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('clientName').value.trim();
      const phone = document.getElementById('clientPhone').value.trim();
      const email = document.getElementById('clientEmail') ? document.getElementById('clientEmail').value.trim() : '';
      const address = document.getElementById('clientAddress') ? document.getElementById('clientAddress').value.trim() : '';
      const notes = document.getElementById('clientNotes') ? document.getElementById('clientNotes').value.trim() : '';
      const scope = serviceScope ? serviceScope.value : 'General Exterior';
      const timing = document.getElementById('preferredTime') ? document.getElementById('preferredTime').value : 'Flexible';
      const selectedCard = document.querySelector('.selector-card.selected');
      const serviceName = selectedCard ? selectedCard.dataset.value : 'Exterior Service';

      // 1. Build summary card HTML
      const modalMessage = document.getElementById('modalMessage');
      if (modalMessage) {
        modalMessage.innerHTML = `
          <div class="summary-service-row">
            <span class="summary-label">Service:</span>
            <span class="summary-val"><strong>${escapeHtml(serviceName)}</strong> (${escapeHtml(scope)})</span>
          </div>
          <div class="summary-service-row">
            <span class="summary-label">Customer:</span>
            <span class="summary-val">${escapeHtml(name)} • <a href="tel:${escapeHtml(phone)}" style="color: var(--cyan-bright); text-decoration: underline;">${escapeHtml(phone)}</a></span>
          </div>
          ${address ? `
          <div class="summary-service-row">
            <span class="summary-label">Location:</span>
            <span class="summary-val">${escapeHtml(address)}</span>
          </div>` : ''}
          <div class="summary-service-row">
            <span class="summary-label">Timing:</span>
            <span class="summary-val">${escapeHtml(timing)}</span>
          </div>
          ${notes ? `
          <div class="summary-service-row">
            <span class="summary-label">Notes:</span>
            <span class="summary-val">${escapeHtml(notes)}</span>
          </div>` : ''}
        `;
      }

      // 2. Prepare pre-filled SMS message and Link
      const smsBody = `Hi TWOZAYZ! I would like a free estimate.\n\nService: ${serviceName} (${scope})\nName: ${name}\nPhone: ${phone}${address ? '\nLocation: ' + address : ''}\nTiming: ${timing}${notes ? '\nDetails: ' + notes : ''}`;
      const smsBtn = document.getElementById('modalSmsBtn');
      if (smsBtn) {
        smsBtn.href = `sms:3862881483?&body=${encodeURIComponent(smsBody)}`;
      }

      // 3. Prepare pre-filled Email link
      const emailBtn = document.getElementById('modalMailBtn');
      if (emailBtn) {
        const mailSubject = `TWOZAYZ Estimate Request: ${serviceName} - ${name}`;
        emailBtn.href = `mailto:Twozayz@gmail.com?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(smsBody)}`;
      }

      // 4. Reset status badge to sending
      const statusBadge = document.getElementById('modalStatusBadge');
      const statusText = document.getElementById('modalStatusText');
      if (statusBadge && statusText) {
        statusBadge.className = 'modal-status-badge status-pending';
        statusText.innerHTML = 'Sending to <strong>Twozayz@gmail.com</strong>...';
      }

      // Show modal immediately
      if (modal) {
        modal.classList.add('active');
      }

      // 5. Send automated background dispatch to Twozayz@gmail.com via FormSubmit AJAX
      fetch('https://formsubmit.co/ajax/Twozayz@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `New Free Estimate: ${serviceName} - ${name} (${phone})`,
          Customer_Name: name,
          Phone_Number: phone,
          Email: email || 'Not provided',
          Address_or_Area: address || 'Lake City, FL',
          Service_Requested: serviceName,
          Scope_Details: scope,
          Preferred_Timing: timing,
          Customer_Notes: notes || 'None',
          _template: 'table'
        })
      })
      .then(response => response.json())
      .then(data => {
        if (statusBadge && statusText) {
          statusBadge.className = 'modal-status-badge status-success';
          statusText.innerHTML = '✅ Notification sent to <strong>Twozayz@gmail.com</strong>!';
        }
      })
      .catch(err => {
        if (statusBadge && statusText) {
          statusBadge.className = 'modal-status-badge status-notice';
          statusText.innerHTML = '⚡ Ready! Click below to send directly via Text or Email.';
        }
      });

      quoteForm.reset();
    });
  }

  if (modalClose) modalClose.addEventListener('click', () => modal.classList.remove('active'));
  if (modalOkBtn) modalOkBtn.addEventListener('click', () => modal.classList.remove('active'));
}

/* ==========================================================================
   5. Live Customer Reviews & Smart Reputation Shield (Option A)
   ========================================================================== */
const TWOZAYZ_SUPABASE_CONFIG = {
  url: window.TWOZAYZ_SUPABASE_URL || 'https://rxkypdnjaptvhyqyollk.supabase.co',
  anonKey: window.TWOZAYZ_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4a3lwZG5qYXB0dmh5cXlvbGxrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0ODMyODEsImV4cCI6MjA4NjA1OTI4MX0.4nHymxb4uoiVD40mId0gvoBLLGkaTxcakQ95jhf1CtQ',
  table: 'twozayz_reviews'
};

const TWOZAYZ_REVIEWS_STORAGE_KEY = 'twozayz_live_reviews_v1';

const RATING_LABELS = {
  5: '5.0 ★ — Spotless Showroom Results!',
  4: '4.0 ★ — Great Service & Results!',
  3: '3.0 ★ — Average Experience (Private Owner Feedback)',
  2: '2.0 ★ — Below Expectations (Private Owner Feedback)',
  1: '1.0 ★ — Needs Immediate Attention (Private Owner Feedback)'
};

function initLiveReviews() {
  const reviewForm = document.getElementById('reviewForm');
  const reviewsGrid = document.getElementById('reviewsGrid');
  const starPicker = document.getElementById('starRatingPicker');
  const starInput = document.getElementById('starRatingInput');
  const starLabel = document.getElementById('starRatingLabel');
  const feedbackBanner = document.getElementById('reviewFormFeedback');
  const submitBtn = document.getElementById('reviewSubmitBtn');

  if (!reviewForm || !reviewsGrid || !starPicker || !starInput) return;

  const starBtns = Array.from(starPicker.querySelectorAll('.star-pick-btn'));

  function setStarSelection(ratingValue) {
    const rating = Math.max(1, Math.min(5, parseInt(ratingValue, 10) || 5));
    starInput.value = String(rating);
    starBtns.forEach(btn => {
      const btnVal = parseInt(btn.dataset.rating, 10);
      btn.classList.toggle('active', btnVal <= rating);
    });
    if (starLabel) {
      starLabel.textContent = RATING_LABELS[rating] || RATING_LABELS[5];
      starLabel.style.color = rating >= 4 ? '#ffd700' : 'var(--cyan-bright)';
    }
  }

  starBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      setStarSelection(btn.dataset.rating);
    });
  });

  // Load saved live reviews on startup
  loadAllPublicReviews(reviewsGrid);

  reviewForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const customerName = (document.getElementById('reviewName').value || '').trim();
    const neighborhood = (document.getElementById('reviewLocation').value || '').trim() || 'Lake City, FL';
    const serviceType = (document.getElementById('reviewService').value || 'Pressure Washing').trim();
    const reviewText = (document.getElementById('reviewComment').value || '').trim();
    const rating = parseInt(starInput.value, 10) || 5;

    if (!customerName || !reviewText) return;

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>⏳ Submitting...</span>';
    }

    const reviewRecord = {
      id: 'local-' + Date.now(),
      customer_name: customerName,
      neighborhood: neighborhood,
      service_type: serviceType,
      rating: rating,
      review_text: reviewText,
      approved: rating >= 4,
      created_at: new Date().toISOString()
    };

    // Option A: Smart Reputation Shield
    if (rating >= 4) {
      saveReviewToLocalCache(reviewRecord);
      prependReviewCard(reviewsGrid, reviewRecord, true);
      updateReviewCountBadge(reviewsGrid);
      await insertReviewToSupabase(reviewRecord);
      sendReviewEmailNotification(reviewRecord, true);

      if (feedbackBanner) {
        feedbackBanner.className = 'review-feedback-banner feedback-public active';
        feedbackBanner.innerHTML = `
          <strong>👑 Thank you, ${escapeHtml(customerName)}!</strong> Your ${rating}-star review is now live on the page above. We appreciate you supporting local Lake City twin-brother owned exterior care!
        `;
      }

      const firstCard = reviewsGrid.querySelector('.review-card');
      if (firstCard && typeof firstCard.scrollIntoView === 'function') {
        setTimeout(() => {
          firstCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 250);
      }
    } else {
      // 1-3 Stars: Route privately to owners so they can make it right first
      await insertReviewToSupabase(reviewRecord);
      sendReviewEmailNotification(reviewRecord, false);

      const directSmsBody = `Hi TWOZAYZ, this is ${customerName} (${neighborhood}). I just shared feedback about my ${serviceType} service: ${reviewText}`;
      const smsHref = `sms:3862881483?&body=${encodeURIComponent(directSmsBody)}`;

      if (feedbackBanner) {
        feedbackBanner.className = 'review-feedback-banner feedback-private active';
        feedbackBanner.innerHTML = `
          <strong>⚡ Thank you for your honest feedback, ${escapeHtml(customerName)}.</strong><br>
          As local twin-brother owners, we stand behind every job 100%. Your message has been sent directly to the owners at <strong>Twozayz@gmail.com</strong> so we can reach out and make this right for you personally.<br>
          <a href="${smsHref}" class="btn btn-phone btn-sm-pill" style="margin-top: 0.75rem; display: inline-flex;">
            💬 Text Owners Directly at (386) 288-1483
          </a>
        `;
      }
    }

    reviewForm.reset();
    setStarSelection(5);

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span aria-hidden="true">⭐</span> <span>Post Customer Review</span>';
    }
  });
}

function getServiceBadgeMeta(serviceType) {
  const val = (serviceType || '').toLowerCase();
  if (val.includes('detail') || val.includes('car') || val.includes('auto')) {
    return { badgeClass: 'badge-detail', label: '🚘 Mobile Car Detailing', cardClass: '', avatarClass: '' };
  }
  if (val.includes('lawn') || val.includes('turf')) {
    return { badgeClass: 'badge-lawn', label: '🌿 Lawn Care & Precision Edging', cardClass: 'card-lawn-review', avatarClass: 'avatar-lawn' };
  }
  if (val.includes('full') || val.includes('package')) {
    return { badgeClass: 'badge-full', label: '👑 Full Property & Auto Package', cardClass: '', avatarClass: '' };
  }
  return { badgeClass: 'badge-pressure', label: '💦 Pressure Washing', cardClass: '', avatarClass: '' };
}

function getInitials(name) {
  const parts = String(name || 'TZ').trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return String(parts[0] || 'TZ').slice(0, 2).toUpperCase();
}

function prependReviewCard(reviewsGrid, rev, highlightNew = false) {
  const meta = getServiceBadgeMeta(rev.service_type);
  const rating = Math.max(4, Math.min(5, parseInt(rev.rating, 10) || 5));
  const starsStr = '★'.repeat(rating) + '☆'.repeat(5 - rating);
  const initials = getInitials(rev.customer_name);

  const card = document.createElement('div');
  card.className = `review-card ${meta.cardClass} ${highlightNew ? 'review-card-live-new' : ''}`.trim();
  card.dataset.reviewId = rev.id || '';
  card.innerHTML = `
    <div class="review-service-badge ${meta.badgeClass}">${meta.label}</div>
    <div class="review-stars" aria-label="${rating} out of 5 stars">${starsStr}</div>
    <p class="review-body">"${escapeHtml(rev.review_text)}"</p>
    <div class="review-author">
      <div class="author-avatar ${meta.avatarClass}" aria-hidden="true">${escapeHtml(initials)}</div>
      <div>
        <div class="author-name">${escapeHtml(rev.customer_name)}</div>
        <div class="author-loc">📍 ${escapeHtml(rev.neighborhood || 'Lake City, FL')} • <span class="verified-tag">✓ Verified Customer</span></div>
      </div>
    </div>
  `;
  reviewsGrid.insertBefore(card, reviewsGrid.firstChild);
}

function updateReviewCountBadge(reviewsGrid) {
  const badge = document.getElementById('liveReviewCountBadge');
  if (!badge || !reviewsGrid) return;
  const totalCards = reviewsGrid.querySelectorAll('.review-card').length;
  badge.textContent = `5.0 Star Rating (${totalCards} Verified Reviews)`;
}

function getLocalCachedReviews() {
  try {
    const raw = localStorage.getItem(TWOZAYZ_REVIEWS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (_) {
    return [];
  }
}

function saveReviewToLocalCache(reviewRecord) {
  try {
    const existing = getLocalCachedReviews();
    existing.unshift(reviewRecord);
    localStorage.setItem(TWOZAYZ_REVIEWS_STORAGE_KEY, JSON.stringify(existing.slice(0, 30)));
  } catch (_) {
    // Ignore storage quota errors
  }
}

async function fetchReviewsFromSupabase() {
  try {
    const endpoint = `${TWOZAYZ_SUPABASE_CONFIG.url}/rest/v1/${TWOZAYZ_SUPABASE_CONFIG.table}?select=*&approved=eq.true&rating=gte.4&order=created_at.desc&limit=20`;
    const res = await fetch(endpoint, {
      headers: {
        apikey: TWOZAYZ_SUPABASE_CONFIG.anonKey,
        Authorization: `Bearer ${TWOZAYZ_SUPABASE_CONFIG.anonKey}`
      }
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (_) {
    return [];
  }
}

async function insertReviewToSupabase(reviewRecord) {
  try {
    const endpoint = `${TWOZAYZ_SUPABASE_CONFIG.url}/rest/v1/${TWOZAYZ_SUPABASE_CONFIG.table}`;
    await fetch(endpoint, {
      method: 'POST',
      headers: {
        apikey: TWOZAYZ_SUPABASE_CONFIG.anonKey,
        Authorization: `Bearer ${TWOZAYZ_SUPABASE_CONFIG.anonKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'
      },
      body: JSON.stringify({
        customer_name: reviewRecord.customer_name,
        neighborhood: reviewRecord.neighborhood,
        service_type: reviewRecord.service_type,
        rating: reviewRecord.rating,
        review_text: reviewRecord.review_text,
        approved: reviewRecord.approved
      })
    });
  } catch (_) {
    // Graceful fallback if table migration has not been run yet
  }
}

async function loadAllPublicReviews(reviewsGrid) {
  const localReviews = getLocalCachedReviews().filter(r => r && r.rating >= 4);
  const remoteReviews = await fetchReviewsFromSupabase();

  const seen = new Set();
  const merged = [...remoteReviews, ...localReviews].filter(rev => {
    const key = `${rev.customer_name}|${rev.review_text}`.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Prepend in chronological order so newest ends up on top
  merged.reverse().forEach(rev => {
    prependReviewCard(reviewsGrid, rev, false);
  });

  updateReviewCountBadge(reviewsGrid);
}

function sendReviewEmailNotification(reviewRecord, isPublic) {
  const subjectPrefix = isPublic
    ? `⭐ New ${reviewRecord.rating}-Star Live Review on TWOZAYZ.com`
    : `⚠️ Private Customer Feedback (${reviewRecord.rating} Stars) - TWOZAYZ`;

  fetch('https://formsubmit.co/ajax/Twozayz@gmail.com', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      _subject: `${subjectPrefix} from ${reviewRecord.customer_name}`,
      Review_Status: isPublic ? 'Published Live on Website (4-5 Stars)' : 'Held Privately for Owner Follow-Up (1-3 Stars)',
      Star_Rating: `${reviewRecord.rating} / 5 Stars`,
      Customer_Name: reviewRecord.customer_name,
      Neighborhood: reviewRecord.neighborhood,
      Service_Received: reviewRecord.service_type,
      Customer_Review: reviewRecord.review_text,
      _template: 'table'
    })
  }).catch(() => {});
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
