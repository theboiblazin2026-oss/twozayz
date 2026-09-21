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

  // 5. General Interactivity & Year
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
  updateSliderData('driveway');
  syncImageWidth();
  window.addEventListener('resize', syncImageWidth);

  let isDragging = false;

  function setSliderPosition(x) {
    const rect = slider.getBoundingClientRect();
    let position = ((x - rect.left) / rect.width) * 100;
    
    if (position < 0) position = 0;
    if (position > 100) position = 100;

    beforeWrapper.style.width = `${position}%`;
    handle.style.left = `${position}%`;
  }

  // Event Listeners for dragging
  slider.addEventListener('mousedown', (e) => {
    isDragging = true;
    setSliderPosition(e.clientX);
  });

  window.addEventListener('mouseup', () => { isDragging = false; });
  window.addEventListener('mousemove', (e) => {
    if (isDragging) setSliderPosition(e.clientX);
  });

  // Touch support for mobile
  slider.addEventListener('touchstart', (e) => {
    isDragging = true;
    setSliderPosition(e.touches[0].clientX);
  }, { passive: true });
  window.addEventListener('touchend', () => { isDragging = false; });
  window.addEventListener('touchmove', (e) => {
    if (isDragging) setSliderPosition(e.touches[0].clientX);
  }, { passive: true });

  // Tab button handler
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const category = btn.dataset.tab;
      updateSliderData(category);
    });
  });

  function updateSliderData(category) {
    const data = transformationData[category] || transformationData.driveway;
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

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#030;");
}
