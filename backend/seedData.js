const mongoose = require('mongoose');
const Booking = require('./models/Booking');
require('dotenv').config();

// Sample package data
const packages = [
    { name: 'Bali Adventure Package', type: 'Adventure', price: 1200 },
    { name: 'Paris Romantic Getaway', type: 'Romance', price: 1800 },
    { name: 'Tokyo Cultural Tour', type: 'Cultural', price: 2000 },
    { name: 'Dubai Luxury Experience', type: 'Luxury', price: 2500 },
    { name: 'Maldives Beach Resort', type: 'Beach', price: 3000 },
    { name: 'Swiss Alps Ski Package', type: 'Adventure', price: 2200 },
    { name: 'New York City Break', type: 'City', price: 1500 },
    { name: 'Caribbean Cruise', type: 'Cruise', price: 1900 },
    { name: 'Thailand Island Hopping', type: 'Beach', price: 1400 },
    { name: 'Iceland Northern Lights', type: 'Nature', price: 2300 }
];

// Sample customer names
const firstNames = ['John', 'Sarah', 'Michael', 'Emma', 'David', 'Lisa', 'James', 'Jessica', 'Robert', 'Maria', 'William', 'Emily', 'Daniel', 'Olivia', 'Matthew'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Wilson', 'Anderson', 'Taylor', 'Thomas', 'Moore'];

// Status options with weights
const statuses = [
    { status: 'Confirmed', weight: 60 },
    { status: 'Pending', weight: 30 },
    { status: 'Cancelled', weight: 10 }
];

// Generate random data
function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function getRandomStatus() {
    const rand = Math.random() * 100;
    let sum = 0;
    for (const { status, weight } of statuses) {
        sum += weight;
        if (rand <= sum) return status;
    }
    return 'Pending';
}

function generatePhoneNumber() {
    return `+1-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`;
}

function getRandomDate(daysAgo) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
    date.setHours(Math.floor(Math.random() * 24));
    date.setMinutes(Math.floor(Math.random() * 60));
    return date;
}

function getFutureDate() {
    const date = new Date();
    date.setDate(date.getDate() + Math.floor(Math.random() * 90 + 7)); // 7-97 days in future
    return date;
}

// Generate sample bookings
function generateSampleBookings(count, daysAgo) {
    const bookings = [];
    
    for (let i = 0; i < count; i++) {
        const pkg = getRandomItem(packages);
        const firstName = getRandomItem(firstNames);
        const lastName = getRandomItem(lastNames);
        const travelers = Math.floor(Math.random() * 4) + 1; // 1-4 travelers
        
        const booking = {
            packageName: pkg.name,
            packageType: pkg.type,
            price: pkg.price,
            bookerDetails: {
                name: `${firstName} ${lastName}`,
                email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
                phone: generatePhoneNumber()
            },
            travelDetails: {
                numberOfTravelers: travelers,
                travelDate: getFutureDate()
            },
            payment: {
                method: getRandomItem(['Credit Card', 'PayPal', 'Bank Transfer'])
            },
            totalAmount: pkg.price * travelers,
            status: getRandomStatus(),
            createdAt: getRandomDate(daysAgo),
            updatedAt: getRandomDate(Math.min(daysAgo, 5))
        };
        
        bookings.push(booking);
    }
    
    return bookings;
}

// Connect to MongoDB and seed data
async function seedDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');
        
        // Clear existing bookings
        const deleteResult = await Booking.deleteMany({});
        console.log(`🗑️  Cleared ${deleteResult.deletedCount} existing bookings`);
        
        // Generate bookings for different time periods
        const sampleBookings = [
            ...generateSampleBookings(3, 0),      // Today: 3 bookings
            ...generateSampleBookings(15, 7),     // Last 7 days: 15 bookings
            ...generateSampleBookings(20, 30),    // Last 30 days: 20 bookings
            ...generateSampleBookings(25, 90),    // Last 90 days: 25 bookings
        ];
        
        // Insert all bookings
        const result = await Booking.insertMany(sampleBookings);
        console.log(`✅ Successfully inserted ${result.length} sample bookings`);
        
        // Show distribution
        const today = sampleBookings.filter(b => {
            const daysDiff = Math.floor((new Date() - new Date(b.createdAt)) / (1000 * 60 * 60 * 24));
            return daysDiff === 0;
        }).length;
        
        const last7Days = sampleBookings.filter(b => {
            const daysDiff = Math.floor((new Date() - new Date(b.createdAt)) / (1000 * 60 * 60 * 24));
            return daysDiff <= 7;
        }).length;
        
        const last30Days = sampleBookings.filter(b => {
            const daysDiff = Math.floor((new Date() - new Date(b.createdAt)) / (1000 * 60 * 60 * 24));
            return daysDiff <= 30;
        }).length;
        
        const statusCount = {
            confirmed: sampleBookings.filter(b => b.status === 'Confirmed').length,
            pending: sampleBookings.filter(b => b.status === 'Pending').length,
            cancelled: sampleBookings.filter(b => b.status === 'Cancelled').length
        };
        
        console.log('\n📊 Data Distribution:');
        console.log(`   Today: ${today} bookings`);
        console.log(`   Last 7 days: ${last7Days} bookings`);
        console.log(`   Last 30 days: ${last30Days} bookings`);
        console.log(`   Last 90 days: ${result.length} bookings`);
        console.log('\n📈 Status Distribution:');
        console.log(`   ✅ Confirmed: ${statusCount.confirmed}`);
        console.log(`   ⏳ Pending: ${statusCount.pending}`);
        console.log(`   ❌ Cancelled: ${statusCount.cancelled}`);
        
        const totalRevenue = sampleBookings
            .filter(b => b.status === 'Confirmed')
            .reduce((sum, b) => sum + b.totalAmount, 0);
        console.log(`\n💰 Total Revenue (Confirmed): $${totalRevenue.toLocaleString()}`);
        
        // Top packages
        const packageCounts = {};
        sampleBookings.forEach(b => {
            packageCounts[b.packageName] = (packageCounts[b.packageName] || 0) + 1;
        });
        const topPackages = Object.entries(packageCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
        
        console.log('\n🏆 Top 5 Packages:');
        topPackages.forEach(([name, count], index) => {
            console.log(`   ${index + 1}. ${name}: ${count} bookings`);
        });
        
        console.log('\n✅ Database seeding completed successfully!');
        console.log('🚀 You can now view the analytics in your admin dashboard');
        
    } catch (error) {
        console.error('❌ Error seeding database:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\n📊 MongoDB connection closed');
    }
}

// Run the seeding
seedDatabase();
