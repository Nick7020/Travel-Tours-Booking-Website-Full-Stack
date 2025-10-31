// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';
let autoRefreshInterval = null;
let autoRefreshEnabled = true;

// Toggle sidebar for mobile
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
}

// Toggle auto-refresh
function toggleAutoRefresh() {
    autoRefreshEnabled = !autoRefreshEnabled;
    const text = document.getElementById('autoRefreshText');
    
    if (text) {
        if (autoRefreshEnabled) {
            text.textContent = 'Auto-Refresh: ON';
            autoRefreshInterval = setInterval(loadBookings, 10000);
        } else {
            text.textContent = 'Auto-Refresh: OFF';
            if (autoRefreshInterval) {
                clearInterval(autoRefreshInterval);
            }
        }
    }
}

// Check backend and database connection
async function checkConnection() {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        const result = await response.json();
        const statusDiv = document.getElementById('connectionStatus');
        if (statusDiv) {
            statusDiv.className = 'connection-status connected';
            statusDiv.innerHTML = `
                ✅ Connected to Backend & Database | 
                ${result.database} | 
                Last updated: ${new Date().toLocaleString()}
            `;
        }
        return true;
    } catch (error) {
        const statusDiv = document.getElementById('connectionStatus');
        if (statusDiv) {
            statusDiv.className = 'connection-status disconnected';
            statusDiv.innerHTML = `❌ Backend Disconnected - Make sure server is running on port 5000`;
        }
        return false;
    }
}

// Load all bookings from backend
async function loadBookings() {
    await checkConnection();
    
    try {
        const response = await fetch(`${API_BASE_URL}/bookings`);
        const result = await response.json();
        
        if (result.success) {
            displayBookings(result.data);
            updateStats(result.data);
        } else {
            throw new Error('Failed to fetch bookings');
        }
    } catch (error) {
        const bookingsList = document.getElementById('bookingsList');
        if (bookingsList) {
            bookingsList.innerHTML = 
                '<div class="no-data"><div class="no-data-icon">❌</div><div>Could not load bookings. Make sure backend server is running.</div></div>';
        }
        console.error('Error loading bookings:', error);
    }
}

// Display bookings in the grid
function displayBookings(bookings) {
    const bookingsList = document.getElementById('bookingsList');
    
    if (!bookingsList) return;
    
    if (bookings.length === 0) {
        bookingsList.innerHTML = `
            <div class="no-data">
                <div class="no-data-icon">📋</div>
                <div>No bookings found in database.</div>
                <div style="margin-top: 0.5rem; font-size: 0.95rem;">Make a booking on the main website to see data here.</div>
            </div>
        `;
        return;
    }

    bookingsList.innerHTML = bookings.map(booking => `
        <div class="booking-card">
            <div class="booking-header">
                <div class="booking-title">${booking.packageName} - ${booking.packageType}</div>
                <span class="status-badge status-${booking.status?.toLowerCase() || 'pending'}">
                    ${booking.status || 'Pending'}
                </span>
            </div>
            
            <div class="booking-meta">
                <div class="meta-item">
                    <span class="meta-label">Customer</span>
                    <span class="meta-value">${booking.bookerDetails.name}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Email</span>
                    <span class="meta-value">${booking.bookerDetails.email}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Phone</span>
                    <span class="meta-value">${booking.bookerDetails.phone}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Travelers</span>
                    <span class="meta-value">${booking.travelDetails.numberOfTravelers} people</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Travel Date</span>
                    <span class="meta-value">${new Date(booking.travelDetails.travelDate).toLocaleDateString()}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Amount</span>
                    <span class="meta-value">$${booking.totalAmount || booking.price * booking.travelDetails.numberOfTravelers}</span>
                </div>
            </div>

            <div class="meta-item">
                <span class="meta-label">Booking ID</span>
                <span class="meta-value" style="font-family: monospace; font-size: 0.9em;">${booking._id}</span>
            </div>

            <div class="booking-actions">
                <button class="action-btn success" onclick="updateBookingStatus('${booking._id}', 'Confirmed')">
                    ✓ Confirm
                </button>
                <button class="action-btn" onclick="updateBookingStatus('${booking._id}', 'Pending')">
                    ⏳ Set Pending
                </button>
                <button class="action-btn danger" onclick="updateBookingStatus('${booking._id}', 'Cancelled')">
                    ✕ Cancel
                </button>
                <button class="action-btn danger" onclick="deleteBooking('${booking._id}')">
                    🗑️ Delete
                </button>
            </div>

            <div class="timestamp">
                Created: ${new Date(booking.createdAt).toLocaleString()}
                ${booking.updatedAt !== booking.createdAt ? 
                  ` | Updated: ${new Date(booking.updatedAt).toLocaleString()}` : ''}
            </div>
        </div>
    `).join('');
}

// Update statistics
function updateStats(bookings) {
    const totalBookingsEl = document.getElementById('totalBookings');
    const pendingBookingsEl = document.getElementById('pendingBookings');
    const confirmedBookingsEl = document.getElementById('confirmedBookings');
    const revenueEl = document.getElementById('revenue');
    
    if (totalBookingsEl) totalBookingsEl.textContent = bookings.length;
    
    const pending = bookings.filter(b => b.status === 'Pending').length;
    if (pendingBookingsEl) pendingBookingsEl.textContent = pending;
    
    const confirmed = bookings.filter(b => b.status === 'Confirmed').length;
    if (confirmedBookingsEl) confirmedBookingsEl.textContent = confirmed;
    
    const revenue = bookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);
    if (revenueEl) revenueEl.textContent = `$${revenue}`;
}

// Export data to JSON file
function exportData() {
    fetch(`${API_BASE_URL}/bookings`)
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                const dataStr = JSON.stringify(result.data, null, 2);
                const dataBlob = new Blob([dataStr], { type: 'application/json' });
                const url = URL.createObjectURL(dataBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `tarang-bookings-${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                
                alert(`Exported ${result.data.length} bookings to JSON file!`);
            }
        })
        .catch(error => {
            alert('Error exporting data: ' + error.message);
        });
}

// Update booking status
async function updateBookingStatus(bookingId, newStatus) {
    try {
        const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus })
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert(`Booking status updated to: ${newStatus}`);
            loadBookings(); // Refresh the list
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        alert('Error updating booking: ' + error.message);
    }
}

// Delete a booking
async function deleteBooking(bookingId) {
    if (!confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('Booking deleted successfully!');
            loadBookings(); // Refresh the list
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        alert('Error deleting booking: ' + error.message);
    }
}

// Clear all data
async function clearAllData() {
    if (!confirm('DANGER ZONE! This will delete ALL bookings from the database. This action cannot be undone. Are you absolutely sure?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/bookings/clear-all`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('All data cleared successfully!');
            loadBookings();
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        alert('Error clearing data: ' + error.message);
    }
}

// Initialize auto-refresh
if (autoRefreshEnabled) {
    autoRefreshInterval = setInterval(loadBookings, 10000);
}

// Load data when page opens
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on a page that needs bookings data
    if (document.getElementById('bookingsList')) {
        loadBookings();
    } else {
        checkConnection();
    }
});
