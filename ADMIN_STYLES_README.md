# Admin Panel Styles Documentation

## Overview
Professional and modern design system for Tarang Travel Admin Panel with dark theme, glassmorphism effects, and smooth animations.

## File Structure
- **admin-styles.css** - Main stylesheet (1,674 lines)
- Links to all admin HTML files:
  - admin-dashboard.html
  - admin-bookings.html
  - admin-customers.html
  - admin-packages.html
  - admin-revenue.html
  - admin-settings.html

## Design Features

### 🎨 Color Scheme
- **Primary**: Indigo (#6366f1)
- **Secondary**: Pink (#ec4899)
- **Success**: Green (#10b981)
- **Warning**: Amber (#f59e0b)
- **Danger**: Red (#ef4444)
- **Dark Background**: #0a0a0f

### ✨ Key Features

#### 1. **Glassmorphism Design**
   - Transparent cards with backdrop blur
   - Subtle borders and shadows
   - Layered depth effect

#### 2. **Smooth Animations**
   - Fade-in animations on load
   - Hover transitions
   - Pulsing status indicators
   - Gradient shifts

#### 3. **Responsive Layout**
   - Breakpoints: 1024px, 768px, 640px
   - Mobile-first approach
   - Collapsible sidebar
   - Touch-friendly buttons

#### 4. **Component Library**

**Navigation:**
- Fixed sidebar with smooth transitions
- Active state indicators
- Mobile hamburger menu

**Stats Cards:**
- Animated on scroll
- Hover lift effects
- Icon backgrounds with gradients
- Trend indicators

**Buttons:**
- Primary, Success, Danger, Warning variants
- Ripple hover effect
- Disabled states
- Icon support

**Status Badges:**
- Pending, Confirmed, Cancelled states
- Pulsing dot animation
- Color-coded borders

**Tables:**
- Responsive data tables
- Hover row highlighting
- Custom avatar cells
- Empty state handling

**Forms:**
- Styled input fields
- Custom toggle switches
- Color picker
- Focus states with ring effect

**Charts:**
- Bar charts with hover effects
- Revenue breakdown
- Progress bars
- Trend indicators

**Cards:**
- Booking cards with metadata
- Package cards with images
- Settings cards
- Activity feed items

### 📱 Responsive Design

**Desktop (>1024px)**
- Full sidebar visible
- Multi-column grids
- Larger typography

**Tablet (768-1024px)**
- Collapsible sidebar
- 2-column layouts
- Adjusted spacing

**Mobile (<640px)**
- Single column
- Full-width components
- Stacked navigation
- Compact spacing

### 🎯 CSS Variables

All design tokens are defined as CSS custom properties:
```css
--primary, --secondary, --success, --warning, --danger
--spacing-xs, --spacing-sm, --spacing-md, --spacing-lg, --spacing-xl
--radius-sm, --radius-md, --radius-lg, --radius-xl, --radius-full
--shadow-sm, --shadow-md, --shadow-lg, --shadow-xl
--transition-fast, --transition-base, --transition-slow
```

### 🔧 Utility Classes

**Spacing:**
- `.mt-1` to `.mt-4` - Margin top
- `.mb-1` to `.mb-4` - Margin bottom

**Visibility:**
- `.hidden` - Hide element
- `.visible` - Show element

**Text Alignment:**
- `.text-center`
- `.text-right`

## Browser Support
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Performance
- Optimized CSS with minimal specificity
- Hardware-accelerated animations
- Efficient selectors
- Modular structure

## Customization

To customize colors, update CSS variables in the `:root` selector:
```css
:root {
    --primary: #your-color;
    --secondary: #your-color;
    /* ... */
}
```

## Components Included

✅ Sidebar Navigation
✅ Header with User Profile
✅ Stats Cards (4 variants)
✅ Connection Status Indicators
✅ Search & Filter Toolbar
✅ Booking Cards
✅ Customer Tables
✅ Package Grid
✅ Revenue Charts
✅ Settings Forms
✅ Activity Feed
✅ Status Badges
✅ Action Buttons
✅ Progress Bars
✅ Toggle Switches
✅ Color Picker
✅ Data Tables
✅ Empty States
✅ Loading States
✅ Mobile Menu
✅ Responsive Layouts

## Notes
- Uses Inter font family (loaded from Google Fonts)
- Requires admin-script.js for interactive functionality
- All animations use CSS transitions and keyframes
- Dark theme optimized for reduced eye strain

---

**Created for**: Tarang Travel Admin Panel
**Version**: 1.0.0
**Last Updated**: October 31, 2025
