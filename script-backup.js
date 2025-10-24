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

// ... THE REST OF YOUR EXISTING CODE CONTINUES EXACTLY AS BEFORE ...