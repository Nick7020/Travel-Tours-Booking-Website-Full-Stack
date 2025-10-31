# 📊 Analytics Data Seeding Guide

## Overview
This guide will help you populate your database with sample booking data to see beautiful analytics in your dashboard!

## 🎯 What You'll Get

After seeding, you'll have **63 sample bookings** distributed across:
- ✅ **Today**: 3 bookings (for hourly view)
- ✅ **Last 7 days**: 15 bookings (for week view)
- ✅ **Last 30 days**: 20 bookings (for month view)
- ✅ **Last 90 days**: 25 bookings (for quarter view)

### Data Distribution:
- **Confirmed**: ~60% (38 bookings)
- **Pending**: ~30% (19 bookings)
- **Cancelled**: ~10% (6 bookings)

## 🚀 How to Seed Data

### Step 1: Navigate to Backend Folder
```bash
cd C:\Users\LENOVO\OneDrive\Desktop\aiwebsite\backend
```

### Step 2: Run Seed Script
```bash
npm run seed
```

### Expected Output:
```
✅ Connected to MongoDB
🗑️  Cleared X existing bookings
✅ Successfully inserted 63 sample bookings

📊 Data Distribution:
   Today: 3 bookings
   Last 7 days: 18 bookings
   Last 30 days: 38 bookings
   Last 90 days: 63 bookings

📈 Status Distribution:
   ✅ Confirmed: 38
   ⏳ Pending: 19
   ❌ Cancelled: 6

💰 Total Revenue (Confirmed): $76,400

🏆 Top 5 Packages:
   1. Maldives Beach Resort: 8 bookings
   2. Dubai Luxury Experience: 7 bookings
   3. Tokyo Cultural Tour: 7 bookings
   4. Paris Romantic Getaway: 6 bookings
   5. Bali Adventure Package: 6 bookings

✅ Database seeding completed successfully!
🚀 You can now view the analytics in your admin dashboard
```

## 📈 View Analytics

### Step 3: Open Admin Dashboard
1. Make sure your backend server is running:
   ```bash
   npm start
   ```

2. Open `admin-dashboard.html` in your browser

### Step 4: Explore Time Filters

#### 📅 **Today View**
- Shows 6 time slots (4-hour intervals)
- Example: 12am-4am, 4am-8am, 8am-12pm, etc.
- Perfect for seeing hourly patterns

#### 📊 **Last 7 Days View** (Default)
- Shows daily bookings for past week
- Labels: Mon, Tue, Wed, Thu, Fri, Sat, Sun
- Best for weekly trends

#### 📅 **Last 30 Days View**
- Shows daily bookings for past month
- Labels: 1, 2, 3... 30 (day numbers)
- Great for monthly patterns

#### 📊 **Last 90 Days View**
- Shows weekly bookings for past quarter
- Labels: W1, W2, W3... W13 (week numbers)
- Ideal for long-term trends

## 🎨 What You'll See

### 1. **Stats Cards Update**
   - Total Bookings: 63
   - Pending: ~19
   - Confirmed: ~38
   - Total Revenue: ~$76,400

### 2. **Booking Trends Chart**
   - **Interactive bars** that grow based on real data
   - **Hover tooltips** showing exact counts
   - **Smooth animations** when changing filters
   - **Color gradient** from indigo to purple

### 3. **Popular Destinations**
   - Top 5 packages with booking counts
   - **Progress bars** showing relative popularity
   - Real percentages based on actual data

### 4. **Recent Activity Feed**
   - Last 5 bookings displayed
   - **Status icons**: ✓ Confirmed, ⏳ Pending, ✕ Cancelled
   - **Time ago format**: "2 min ago", "1 hour ago"
   - Auto-updates every 15 seconds

## 🔄 Re-Seed Data

Want fresh data? Run the seed command again:
```bash
npm run seed
```

**Note**: This will:
- ⚠️ Clear all existing bookings
- ✅ Insert fresh sample data
- 🔄 Reset all statistics

## 🧪 Testing Scenarios

### Scenario 1: Test Today's View
1. Seed the data
2. Select "Today" from dropdown
3. See bookings distributed across 6 time slots
4. Most bookings in business hours (8am-8pm)

### Scenario 2: Test Week View
1. Select "Last 7 days"
2. See daily distribution
3. Watch bars animate to different heights
4. Hover to see exact numbers

### Scenario 3: Test Month View
1. Select "Last 30 days"
2. See 30 day bars
3. Notice pattern over the month
4. Identify peak booking days

### Scenario 4: Test Quarter View
1. Select "Last 90 days"
2. See 13 week groupings
3. Analyze long-term trends
4. Perfect for quarterly reports

## 📦 Sample Packages Included

The seed data includes 10 popular packages:

1. 🏝️ **Bali Adventure Package** - $1,200
2. 🗼 **Paris Romantic Getaway** - $1,800
3. 🗾 **Tokyo Cultural Tour** - $2,000
4. 🏙️ **Dubai Luxury Experience** - $2,500
5. 🏖️ **Maldives Beach Resort** - $3,000
6. ⛷️ **Swiss Alps Ski Package** - $2,200
7. 🗽 **New York City Break** - $1,500
8. 🚢 **Caribbean Cruise** - $1,900
9. 🏝️ **Thailand Island Hopping** - $1,400
10. 🌌 **Iceland Northern Lights** - $2,300

## 🎯 Pro Tips

### Tip 1: Compare Time Periods
- Switch between filters to see data granularity
- Today = Hourly patterns
- Week = Daily patterns
- Month = Monthly trends
- Quarter = Weekly trends

### Tip 2: Watch Auto-Refresh
- Dashboard refreshes every 15 seconds
- Make a booking and watch it appear
- Confirm a booking and watch stats update

### Tip 3: Export Data
- Go to Bookings page
- Click "Export Data" button
- Get JSON file with all bookings
- Use for reports or backup

### Tip 4: Test Status Changes
- Go to Bookings page
- Change booking status
- Go back to Dashboard
- Watch stats update automatically

## 🐛 Troubleshooting

### Problem: Seed Script Fails
**Solution:**
```bash
# Make sure MongoDB URI is correct in .env file
# Check if MongoDB is running
npm run seed
```

### Problem: Charts Show "No data"
**Solution:**
- Verify seed script ran successfully
- Check browser console for errors
- Refresh the dashboard page
- Ensure backend is running

### Problem: Old Data Still Showing
**Solution:**
```bash
# Re-run seed to clear and refresh
npm run seed
```
Then refresh browser (Ctrl+F5)

## 📊 Database Structure

Each booking contains:
```javascript
{
  packageName: "Bali Adventure Package",
  packageType: "Adventure",
  price: 1200,
  bookerDetails: {
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1-555-123-4567"
  },
  travelDetails: {
    numberOfTravelers: 2,
    travelDate: "2025-02-15"
  },
  totalAmount: 2400,
  status: "Confirmed",
  createdAt: "2025-10-28T14:30:00.000Z",
  updatedAt: "2025-10-28T14:30:00.000Z"
}
```

## 🎉 Success Indicators

You'll know it's working when:
- ✅ Stats cards show non-zero numbers
- ✅ Chart bars have varying heights
- ✅ Popular destinations list shows real packages
- ✅ Activity feed shows recent bookings
- ✅ Filter dropdown changes chart data
- ✅ Hovering shows tooltips

## 🔄 Clean Up

To remove all sample data:
```bash
# Option 1: Use admin panel
# Go to Settings > Danger Zone > Clear All Data

# Option 2: Run seed again (auto-clears first)
npm run seed
```

---

## 📝 Quick Start Commands

```bash
# 1. Seed database
cd backend
npm run seed

# 2. Start server
npm start

# 3. Open dashboard
# Open admin-dashboard.html in browser

# 4. Enjoy analytics! 🎉
```

---

**Last Updated:** October 31, 2025  
**Version:** 1.0.0  
**Status:** ✅ Ready to Use
