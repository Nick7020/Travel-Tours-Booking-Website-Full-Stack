// ==================== BACKEND INTEGRATION ====================
const API_BASE_URL = 'http://localhost:5000/api';

// Test backend connection on page load
async function checkBackendConnection() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    const result = await response.json();
    console.log('✅ Backend connected:', result.message);
    return true;
  } catch (error) {
    console.log('⚠️ Backend not connected, using frontend only');
    return false;
  }
}

// Submit booking to backend
async function submitBookingToBackend(bookingData) {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      showNotification('🎉 Booking submitted successfully! We will contact you soon.', 'success');
      return true;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Error submitting booking:', error);
    // Fallback: save to localStorage
    saveBookingLocally(bookingData);
    showNotification('📝 Booking saved locally. We will process it soon.', 'info');
    return true;
  }
}

// Fallback function
function saveBookingLocally(bookingData) {
  let bookings = JSON.parse(localStorage.getItem('tarangBookings') || '[]');
  bookings.push({
    ...bookingData,
    id: Date.now(),
    timestamp: new Date().toISOString()
  });
  localStorage.setItem('tarangBookings', JSON.stringify(bookings));
}

// Notification system
function showNotification(message, type = 'info') {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll('.notification');
  existingNotifications.forEach(notif => notif.remove());
  
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
    color: white;
    border-radius: 5px;
    z-index: 10000;
    font-weight: bold;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    animation: slideInRight 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }
  }, 4000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOutRight {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;
document.head.appendChild(style);
// ==================== END BACKEND INTEGRATION ====================

/* ----------------- Basic DOM refs ----------------- */
const sections = Array.from(document.querySelectorAll('.page'));
let currentSection = 0;

/* ----------------- Full-page controlled scrolling (smooth with rAF) ----------------- */
let isScrolling = false;
let isAnimating = false;
let scrollCooldownUntil = 0;
const SCROLL_COOLDOWN_MS = 500;

function scrollToSection(index){
  if(index < 0 || index >= sections.length) return;
  const vh = window.innerHeight;
  const targetY = index * vh;
  animateScrollTo(targetY, Math.min(800, Math.max(300, Math.abs(targetY - window.pageYOffset) * 0.8)));
  currentSection = index;
}
function animateScrollTo(targetY, duration) {
  isAnimating = true;
  const startY = window.pageYOffset;
  const distance = targetY - startY;
  const startTime = performance.now();

  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeInOutQuad = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
    const currentY = startY + distance * easeInOutQuad;
    window.scrollTo(0, currentY);
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      isAnimating = false;
      updateCurrentSection(); // ensure sync after animation
    }
  }
  requestAnimationFrame(step);
}

function updateCurrentSection(){
  const scrollY = window.pageYOffset;
  const vh = window.innerHeight;
  let activeIndex = Math.round(scrollY / vh);
  activeIndex = Math.max(0, Math.min(sections.length - 1, activeIndex));
  currentSection = activeIndex;
}

function canScrollWithinSection(section, deltaY){
  if (!section) return false;
  const rect = section.getBoundingClientRect();
  const tolerance = 4;
  if (deltaY > 0) {
    return rect.bottom > window.innerHeight + tolerance;
  }
  if (deltaY < 0) {
    return rect.top < -tolerance;
  }
  return false;
}

let scrollUpdateScheduled = false;
// Removed scroll event listener to prevent automatic section updates during natural scrolling

/* allow wheel to navigate pages, but block when mouse is over carousel or modal open */
const carouselContainer = document.getElementById('carousel');
const overlay = document.getElementById('bookingOverlay');

// Wheel event listener removed to disable auto-scroll between sections

function releaseScrollLock(){
  if (!isScrolling) return;
  if (performance.now() >= scrollCooldownUntil) {
    isScrolling = false;
    return;
  }
  requestAnimationFrame(releaseScrollLock);
}

/* ----------------- Keyboard navigation removed to disable auto-scroll ----------------- */
// Arrow key navigation disabled

/* ----------------- Carousel: buttons + drag + touch ----------------- */
const leftBtn = document.querySelector('.left-btn');
const rightBtn = document.querySelector('.right-btn');
const carousel = carouselContainer;
let isDown = false, startX, scrollLeft;

function getScrollStep(){
  // scroll by one card width (approx)
  const visibleCount = window.innerWidth <= 640 ? 1 : (window.innerWidth <= 980 ? 2 : 3);
  return Math.floor(carousel.clientWidth / visibleCount);
}

if (leftBtn && rightBtn && carousel) {
  rightBtn.addEventListener('click', () => {
    carousel.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
  });
  leftBtn.addEventListener('click', () => {
    carousel.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
  });

  // mouse drag
  carousel.addEventListener('mousedown', (e) => {
    isDown = true;
    carousel.classList.add('dragging');
    startX = e.pageX - carousel.offsetLeft;
    scrollLeft = carousel.scrollLeft;
  });
  carousel.addEventListener('mouseleave', () => { isDown = false; carousel.classList.remove('dragging'); });
  carousel.addEventListener('mouseup', () => { isDown = false; carousel.classList.remove('dragging'); });
  carousel.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - carousel.offsetLeft;
    const walk = (x - startX) * 1; // scroll speed
    carousel.scrollLeft = scrollLeft - walk;
  });

  // touch
  carousel.addEventListener('touchstart', (e) => {
    startX = e.touches[0].pageX - carousel.offsetLeft;
    scrollLeft = carousel.scrollLeft;
  });
  carousel.addEventListener('touchmove', (e) => {
    const x = e.touches[0].pageX - carousel.offsetLeft;
    const walk = (x - startX);
    carousel.scrollLeft = scrollLeft - walk;
  });
}

/* ----------------- Modal (multi-step) logic ----------------- */
const bookButtons = document.querySelectorAll('.book-now-inside');
const modalOverlay = document.getElementById('bookingOverlay');
const modalDialog = modalOverlay ? modalOverlay.querySelector('.modal') : null;
const modalClose = document.getElementById('modalClose');

const steps = Array.from(document.querySelectorAll('.step'));
function showModalStep(stepIndex){
  steps.forEach((s, idx) => s.classList.toggle('active', idx === stepIndex));
}

function triggerModalAnimation(){
  if (!modalDialog) return;
  modalDialog.classList.remove('animate-in');
  void modalDialog.offsetWidth; // force reflow to restart animation
  modalDialog.classList.add('animate-in');
}

// default hide
if (modalOverlay) {
  modalOverlay.style.display = 'none';
  modalOverlay.setAttribute('aria-hidden', 'true');
}

// state
let modalState = {
  packageName: null,
  packageBulletsHTML: null,
  type: null,
  pricePerPerson: 0,
  bookerName: '',
  bookerEmail: '',
  bookerPhone: '',
  numTravelers: 1,
  travelDate: ''
};

// open modal when Book Now clicked
bookButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    const button = e.target;
    triggerButtonAnimation(button);

    const card = btn.closest('.package-card');
    const packageName = card.dataset.package;
    const bullets = card.querySelector('.package-bullets').innerHTML;
    modalState.packageName = packageName;
    modalState.packageBulletsHTML = bullets;

    // fill modal content
    document.getElementById('modal-package-title').innerText = packageName;
    document.getElementById('modal-package-bullets').innerHTML = `<ul style="margin-left:18px; color:#666;">${bullets}</ul>`;

    if (!modalOverlay) return;
    modalOverlay.style.display = 'flex';
    modalOverlay.setAttribute('aria-hidden', 'false');
    triggerModalAnimation();
    showModalStep(0); // step index 0 = m-step-1
  });
});

// close modal
if (modalClose) {
  modalClose.addEventListener('click', closeModal);
}
if (modalOverlay) {
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
}
function closeModal(){
  if (!modalOverlay) return;
  modalOverlay.style.display = 'none';
  modalOverlay.setAttribute('aria-hidden', 'true');
  if (modalDialog) {
    modalDialog.classList.remove('animate-in');
  }
}

/* Prev / Next controls inside modal */
document.addEventListener('click', (e) => {
  const target = e.target;

  // Next buttons
  if (target.matches('.next-btn')) {
    const next = target.dataset.next ? parseInt(target.dataset.next,10) : null;
    if (next) {
      // validation before moving
      if (!validateModalStep(next - 1)) return;
      showModalStep(next - 1);
    } else if (target.id === 'confirmPayment') {
      // final confirm (can be extended to actually process payment)
      alert('Payment confirmed. Thank you!');
      closeModal();
    }
  }

  // Prev buttons
  if (target.matches('.prev-btn')) {
    const prev = target.dataset.prev ? parseInt(target.dataset.prev,10) : null;
    if (prev) showModalStep(prev - 1);
    else showModalStep(0);
  }

  // Package type selection
  if (target.closest('.package-type-card')) {
    const card = target.closest('.package-type-card');
    document.querySelectorAll('.package-type-card').forEach(c=>c.classList.remove('selected'));
    card.classList.add('selected');
    modalState.type = card.dataset.type;
    modalState.pricePerPerson = Number(card.dataset.price);
  }
});

/* Validate modal steps: returns true if OK, otherwise shows a small alert */
function validateModalStep(stepIdx){
  // stepIdx 0 = after step1 moving to step2 (no validation needed)
  if (stepIdx === 1) return true;

  // step 2 -> step3 (after selecting package type)
  if (stepIdx === 2) {
    if (!modalState.type) { alert('Please select a package type (Budget/Standard/Luxury).'); return false; }
    return true;
  }

  // step 3 -> step4 (booker details)
  if (stepIdx === 3) {
    const name = document.getElementById('bookerName').value.trim();
    const email = document.getElementById('bookerEmail').value.trim();
    const phone = document.getElementById('bookerPhone').value.trim();
    if (!name || !email || !phone) { alert('Please enter name, email, and phone.'); return false; }
    modalState.bookerName = name; modalState.bookerEmail = email; modalState.bookerPhone = phone;
    return true;
  }

  // step 4 -> step5 (travel details)
  if (stepIdx === 4) {
    const nv = document.getElementById('numTravelers').value;
    const dt = document.getElementById('travelDate').value;
    if (!nv || !dt) { alert('Please select number of travelers and travel date.'); return false; }
    modalState.numTravelers = Number(nv);
    modalState.travelDate = dt;
    // calculate billing and populate
    populateBilling();
    return true;
  }

  // step 5 -> step6 (no validation)
  return true;
}

/* populate billing */
function populateBilling(){
  const price = modalState.pricePerPerson || 0;
  const n = modalState.numTravelers || 1;
  const subtotal = price * n;
  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  const html = `
    <p><strong>Package:</strong> ${modalState.packageName}</p>
    <p><strong>Type:</strong> ${modalState.type} ($${price}/person)</p>
    <p><strong>Travelers:</strong> ${n}</p>
    <p><strong>Travel date:</strong> ${modalState.travelDate}</p>
    <hr>
    <p><strong>Subtotal:</strong> $${subtotal.toFixed(2)}</p>
    <p><strong>GST (18%):</strong> $${gst.toFixed(2)}</p>
    <h3>Total: $${total.toFixed(2)}</h3>
  `;
  document.getElementById('billingSummary').innerHTML = html;
}

/* Confirm Payment click (on final step button with id confirmPayment) */
const confirmPaymentBtn = document.getElementById('confirmPayment');
if (confirmPaymentBtn) {
  confirmPaymentBtn.addEventListener('click', async () => {
    const pay = document.querySelector('input[name="paymentMethod"]:checked');
    if (!pay) { 
      showNotification('Please choose a payment method.', 'error'); 
      return; 
    }
    
    // Prepare booking data for backend
    const bookingData = {
      packageName: modalState.packageName,
      packageType: modalState.type,
      price: modalState.pricePerPerson,
      bookerDetails: {
        name: modalState.bookerName,
        email: modalState.bookerEmail,
        phone: modalState.bookerPhone
      },
      travelDetails: {
        numberOfTravelers: modalState.numTravelers,
        travelDate: modalState.travelDate
      },
      payment: {
        method: pay.value
      },
      totalAmount: modalState.pricePerPerson * modalState.numTravelers
    };
    
    const success = await submitBookingToBackend(bookingData);
    if (success) {
      closeModal();
      resetModalState();
    }
  });
}

function resetModalState() {
  modalState = {
    packageName: null,
    packageBulletsHTML: null,
    type: null,
    pricePerPerson: 0,
    bookerName: '',
    bookerEmail: '',
    bookerPhone: '',
    numTravelers: 1,
    travelDate: ''
  };
}

/* Ensure initial state: page loads at top */
document.addEventListener('DOMContentLoaded', () => {
  window.scrollTo(0, 0);
  currentSection = 0;

  // Make the hero section visible immediately
  const heroSection = document.getElementById('hero');
  if (heroSection) {
    heroSection.classList.add('visible');
  }

  // Check backend connection
  checkBackendConnection();
});
document.getElementById("explorePackagesBtn").addEventListener('click',
  (e) => {
    const button = e.target.closest('.btn');
    triggerButtonAnimation(button);
    smoothScrollToSection('packages');
  }
);
function navigateToExplore() {
  // Scroll smoothly to the section with id 'packages'
  const targetSection = document.getElementById('packages');
  if (!targetSection) return;

  targetSection.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
}


document.getElementById("ourOfferingsBtn").addEventListener('click',
  (e) => {
    const button = e.target.closest('.btn');
    triggerButtonAnimation(button);
    smoothScrollToSection('offerings');
  }
);

function triggerButtonAnimation(button) {
  if (!button) return;

  // Add ripple effect
  button.classList.add('ripple');

  // Add pulse animation
  button.classList.add('clicked');

  // Remove ripple after animation
  setTimeout(() => {
    button.classList.remove('ripple');
  }, 600);

  // Remove pulse class after animation completes
  setTimeout(() => {
    button.classList.remove('clicked');
  }, 600);
}

/* ----------------- Section Transition Animations ----------------- */
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

// Observe all sections
document.querySelectorAll('.page').forEach(section => {
  sectionObserver.observe(section);
});

/* ----------------- Enhanced Smooth Scrolling with Animation Trigger ----------------- */
function smoothScrollToSection(sectionId) {
  const targetSection = document.getElementById(sectionId);
  if (!targetSection) return;

  // First ensure the target section is visible (in case it hasn't been scrolled to yet)
  targetSection.classList.add('visible');

  // Then scroll to it smoothly
  targetSection.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
}

// ...existing code...

const heroBookingBtn = document.getElementById('bookYourJourneyBtn');
const heroModal = document.getElementById('heroBookingModal');
const heroModalClose = document.getElementById('heroModalClose');
const packageCards = document.querySelectorAll('.package-type-card');

heroBookingBtn.addEventListener('click', () => {
  heroModal.style.display = 'flex';
  heroModal.setAttribute('aria-hidden', 'false');
});

heroModalClose.addEventListener('click', () => {
  heroModal.style.display = 'none';
  heroModal.setAttribute('aria-hidden', 'true');
});

// Close modal on clicking outside
heroModal.addEventListener('click', (e) => {
  if(e.target === heroModal){
    heroModal.style.display = 'none';
    heroModal.setAttribute('aria-hidden', 'true');
  }
});

// Select package type
packageCards.forEach(card => {
  card.addEventListener('click', () => {
    packageCards.forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
  });
});

// Hero Booking Form Submission
document.getElementById('heroBookingForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const selectedType = document.querySelector('.package-type-card.selected');
  if (!selectedType) {
    showNotification('Please select a package type!', 'error');
    return;
  }

  const bookingData = {
    packageName: document.getElementById('heroPackage').value,
    packageType: selectedType.dataset.type,
    price: parseInt(selectedType.dataset.price),
    bookerDetails: {
      name: document.getElementById('heroName').value,
      email: document.getElementById('heroEmail').value,
      phone: document.getElementById('heroPhone').value
    },
    travelDetails: {
      numberOfTravelers: parseInt(document.getElementById('numTravelers').value),
      travelDate: document.getElementById('heroDate').value
    },
    totalAmount: parseInt(selectedType.dataset.price) * parseInt(document.getElementById('numTravelers').value)
  };

  const success = await submitBookingToBackend(bookingData);
  if (success) {
    e.target.reset();
    heroModal.style.display = 'none';
  }
});

// Travel Date Input: Disallow past dates
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('travelDate');
    if (!input) return;

    // Build today's date as YYYY-MM-DD (required format for date inputs)
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;

    // Disallow past dates and optionally prefill with today
    input.min = todayStr;             // prevents selecting earlier dates in the picker
    if (!input.value) input.value = todayStr;  // optional: start at today

    // Extra guard: if a past date is typed manually, show a message
    input.addEventListener('input', () => {
      if (input.value && input.value < input.min) {
        input.setCustomValidity(`Please choose a date on or after ${todayStr}.`);
      } else {
        input.setCustomValidity('');
      }
    });
  });