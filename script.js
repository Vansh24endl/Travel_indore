/**
 * Explorer Pro - Complete Travel Rewards System
 * Features: Auth, Multiple Locations, Points, Badges, Custom Locations
 */

// ==================== GLOBAL STATE ====================
let currentUser = null;
let appState = {
    selected: [],
    total: 0,
    members: 1,
    currentFilter: 'all',
    currentLocation: 'Indore'
};

// ==================== LOCATIONS & DESTINATIONS DATA ====================
const locationsData = {
    'Indore': [
        { id: '1', name: 'Rajwada Palace', category: 'heritage', description: 'Historic royal palace with stunning Indo-Saracenic architecture', duration: '1-2 hours', rating: 4.8, reviews: 2543, price: 350, image: 'https://images.unsplash.com/photo-1595928642581-f50f4f3453a5?auto=format&fit=crop&q=80&w=600' },
        { id: '2', name: 'Chappan Dukan', category: 'food', description: 'Famous food street with 56 shops offering local delicacies', duration: '2-3 hours', rating: 4.6, reviews: 3142, price: 180, image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&q=80&w=600' },
        { id: '3', name: 'Khajrana Ganesh', category: 'heritage', description: 'Revered temple dedicated to Lord Ganesha. Most powerful spiritual spot.', duration: '45 mins', rating: 4.9, reviews: 4287,price: 0, image: 'https://images.unsplash.com/photo-1544011501-a9917d16ba4d?auto=format&fit=crop&q=80&w=600' },
        { id: '4', name: 'Lotus Valley', category: 'nature', description: 'Serene natural valley with beautiful lotus ponds. Perfect for photography.', duration: '1.5 hours', rating: 4.7, reviews: 1856, price: 250, image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=600' },
        { id: '5', name: 'Mhow War Memorial', category: 'heritage', description: 'Monument dedicated to soldiers. Historical significance and scenic views.', duration: '1 hour', rating: 4.5, reviews: 892, price: 100, image: 'https://images.unsplash.com/photo-1533900798318-6b8da08a523e?auto=format&fit=crop&q=80&w=600' },
        { id: '6', name: 'Patalpani Waterfall', category: 'nature', description: 'Beautiful waterfall surrounded by greenery. Best during monsoon.', duration: '2 hours', rating: 4.7, reviews: 1324, price: 150, image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=600' },
        { id: '7', name: 'Street Food Tour', category: 'food', description: 'Guided tour of Indore\'s famous street food joints and local eateries.', duration: '2.5 hours', rating: 4.8, reviews: 2156, price: 220, image: 'https://images.unsplash.com/photo-1589985391892-4b31bebf36c1?auto=format&fit=crop&q=80&w=600' },
        { id: '8', name: 'Central Museum', category: 'heritage', description: 'Museum showcasing Indore\'s history, art, and culture collections.', duration: '1.5 hours', rating: 4.3, reviews: 645, price: 80, image: 'https://images.unsplash.com/photo-1564635308751-d1c3a2db8785?auto=format&fit=crop&q=80&w=600' }
    ],
    'Bhopal': [
        { id: '101', name: 'Taj-ul-Masajid', category: 'heritage', description: 'One of the largest mosques in India with magnificent architecture.', duration: '1 hour', rating: 4.8, reviews: 1856, price: 50, image: 'https://images.unsplash.com/photo-1544512904b4-5d0f0aaef0fd?auto=format&fit=crop&q=80&w=600' },
        { id: '102', name: 'Van Vihar National Park', category: 'nature', description: 'Beautiful park with lakes, walking trails, and wildlife sanctuary.', duration: '2.5 hours', rating: 4.6, reviews: 2234, price: 200, image: 'https://images.unsplash.com/photo-1474574556141-7dee08c40f28?auto=format&fit=crop&q=80&w=600' },
        { id: '103', name: 'Bhopal Lake Promenade', category: 'nature', description: 'Scenic lakeside promenade perfect for evening walks and photography.', duration: '1.5 hours', rating: 4.7, reviews: 1546, price: 0, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600' },
        { id: '104', name: 'Royal Cafe & Market', category: 'food', description: 'Legendary cafe and market for local snacks and shopping.', duration: '2 hours', rating: 4.5, reviews: 987, price: 150, image: 'https://images.unsplash.com/photo-1555939594-58d7cb561b1b?auto=format&fit=crop&q=80&w=600' },
        { id: '105', name: 'Sanchi Stupa', category: 'heritage', description: 'UNESCO World Heritage Site with ancient Buddhist monuments.', duration: '3 hours', rating: 4.9, reviews: 3456, price: 300, image: 'https://images.unsplash.com/photo-1605662881864-01c2b04b8a28?auto=format&fit=crop&q=80&w=600' }
    ],
    'Ujjain': [
        { id: '201', name: 'Mahakaleshwar Temple', category: 'heritage', description: 'Ancient Shiva temple on the banks of Shipra river, one of 12 Jyotirlingas.', duration: '1.5 hours', rating: 4.9, reviews: 4532, price: 0, image: 'https://images.unsplash.com/photo-1548248189-7c2dc6e70af0?auto=format&fit=crop&q=80&w=600' },
        { id: '202', name: 'Ram Ghat', category: 'nature', description: 'Historic ghat on Shipra river with morning rituals and scenic views.', duration: '1 hour', rating: 4.6, reviews: 1234, price: 50, image: 'https://images.unsplash.com/photo-1508003516284-d134e4db5ba5?auto=format&fit=crop&q=80&w=600' },
        { id: '203', name: 'Surbandhan Garden', category: 'nature', description: 'Beautiful garden with historical significance and peaceful ambiance.', duration: '1.5 hours', rating: 4.4, reviews: 678, price: 80, image: 'https://images.unsplash.com/photo-1469022563149-aa64dbd37dae?auto=format&fit=crop&q=80&w=600' },
        { id: '204', name: 'Kartik Mas Fair', category: 'heritage', description: 'Annual fair with religious gatherings, shopping, and cultural events.', duration: 'Full day', rating: 4.7, reviews: 892, price: 400, image: 'https://images.unsplash.com/photo-1585859695384-5a60d99583a7?auto=format&fit=crop&q=80&w=600' }
    ],
    'Omkareshwar': [
        { id: '301', name: 'Omkareshwar Temple', category: 'heritage', description: 'Sacred hilltop temple on an island in the Narmada river.', duration: '2 hours', rating: 4.9, reviews: 2876, price: 0, image: 'https://images.unsplash.com/photo-1552520683-7be502fe00b7?auto=format&fit=crop&q=80&w=600' },
        { id: '302', name: 'Narmada River Cruise', category: 'nature', description: 'Scenic boat ride on the Narmada river with beautiful landscape views.', duration: '1.5 hours', rating: 4.8, reviews: 1546, price: 250, image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=600' },
        { id: '303', name: 'Siddheshwar Temple', category: 'heritage', description: 'Ancient temple with intricate stone carvings and spiritual significance.', duration: '1 hour', rating: 4.7, reviews: 934, price: 0, image: 'https://images.unsplash.com/photo-1556243184-f31e04a579cb?auto=format&fit=crop&q=80&w=600' }
    ]
};

// Badges definition
const badgesDefinition = {
    'explorer': { name: '🗺️ Explorer', description: 'Visit 5 destinations', threshold: 5 },
    'foodie': { name: '🍴 Foodie', description: 'Visit 3 food places', threshold: 3 },
    'nature_lover': { name: '🌿 Nature Lover', description: 'Visit 3 nature spots', threshold: 3 },
    'heritage_guardian': { name: '🏛️ Heritage Guardian', description: 'Visit 5 heritage sites', threshold: 5 },
    'points_collector': { name: '⭐ Points Collector', description: 'Earn 500 points', threshold: 500 },
    'travel_master': { name: '🎖️ Travel Master', description: 'Complete 10 trips', threshold: 10 }
};

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    loadUserFromStorage();
    if (currentUser) {
        showMainApp();
        updateStartEndPoints();
        renderDestinations('all');
        updateSummary();
        updateUserPoints();
    } else {
        showLoginScreen();
    }
});

// ==================== AUTHENTICATION ====================
function switchAuthTab(tab) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');

    if (tab === 'login') {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        loginTab.classList.add('bg-white', 'text-indigo-600', 'shadow-sm');
        loginTab.classList.remove('text-slate-600');
        registerTab.classList.remove('bg-white', 'text-indigo-600', 'shadow-sm');
        registerTab.classList.add('text-slate-600');
    } else {
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
        registerTab.classList.add('bg-white', 'text-indigo-600', 'shadow-sm');
        registerTab.classList.remove('text-slate-600');
        loginTab.classList.remove('bg-white', 'text-indigo-600', 'shadow-sm');
        loginTab.classList.add('text-slate-600');
    }
}

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Simple demo auth
    if (email && password) {
        currentUser = {
            id: Math.random(),
            email: email,
            name: email.split('@')[0],
            points: 0,
            badges: [],
            trips: [],
            customLocations: [],
            createdAt: new Date()
        };
        saveUserToStorage();
        showMainApp();
        renderDestinations('all');
        updateSummary();
        updateUserPoints();
    }
}

function handleRegister(event) {
    event.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    if (name && email && password) {
        currentUser = {
            id: Math.random(),
            email: email,
            name: name,
            points: 0,
            badges: [],
            trips: [],
            customLocations: [],
            createdAt: new Date()
        };
        saveUserToStorage();
        showMainApp();
        renderDestinations('all');
        updateSummary();
        updateUserPoints();
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('explorerProUser');
    location.reload();
}

function saveUserToStorage() {
    localStorage.setItem('explorerProUser', JSON.stringify(currentUser));
}

function loadUserFromStorage() {
    const stored = localStorage.getItem('explorerProUser');
    if (stored) {
        currentUser = JSON.parse(stored);
    }
}

function showLoginScreen() {
    document.getElementById('loginscreen').classList.remove('hidden');
}

function showMainApp() {
    document.getElementById('loginscreen').classList.add('hidden');
    document.getElementById('navbar').classList.remove('hidden');
    document.getElementById('mainContent').classList.remove('hidden');
}

// ==================== LOCATIONS ====================
function switchLocation(location) {
    appState.currentLocation = location;
    document.querySelectorAll('.location-btn').forEach(btn => {
        btn.classList.remove('bg-indigo-600', 'text-white');
        btn.classList.add('bg-white', 'text-slate-700');
    });
    const locBtn = document.getElementById('loc' + location);
    if (locBtn) {
        locBtn.classList.add('bg-indigo-600', 'text-white');
    }
    document.getElementById('currentLocation').textContent = location;
    appState.selected = [];
    appState.total = 0;
    
    // Show/hide add destination button for custom locations
    const addDestBtn = document.getElementById('addDestBtn');
    if (mightBeCustomLocation(location)) {
        addDestBtn.style.display = 'block';
    } else {
        addDestBtn.style.display = 'none';
    }
    
    // Update start and end points with destination names
    updateStartEndPoints();
    
    renderDestinations('all');
    updateSummary();
}

function updateStartEndPoints() {
    const destinations = locationsData[appState.currentLocation] || [];
    const startSelect = document.getElementById('startPoint');
    const endSelect = document.getElementById('endPoint');
    
    // Clear existing options
    startSelect.innerHTML = '<option value="">Select a starting point</option>';
    endSelect.innerHTML = '<option value="">Select an ending point</option>';
    
    // Add destination names as options
    destinations.forEach(dest => {
        const option1 = document.createElement('option');
        option1.value = dest.name;
        option1.textContent = dest.name;
        startSelect.appendChild(option1);
        
        const option2 = document.createElement('option');
        option2.value = dest.name;
        option2.textContent = dest.name;
        endSelect.appendChild(option2);
    });
}

function showAddLocation() {
    const locationName = prompt('Enter new location name (city/place):');
    if (locationName && locationName.trim()) {
        if (!locationsData[locationName]) {
            locationsData[locationName] = [];
            currentUser.customLocations.push(locationName);
            saveUserToStorage();

            // Create button for new location
            const btn = document.createElement('button');
            btn.id = 'loc' + locationName;
            btn.className = 'location-btn px-6 py-2.5 rounded-full border-2 border-slate-200 text-sm font-semibold transition bg-white text-slate-700';
            btn.textContent = locationName;
            btn.onclick = () => switchLocation(locationName);
            document.querySelector('[onclick="showAddLocation()"]').parentElement.insertBefore(btn, document.querySelector('[onclick="showAddLocation()"]'));

            alert('✓ Location "' + locationName + '" added! Switch to it and add destinations.');
            switchLocation(locationName);
        } else {
            alert('This location already exists!');
        }
    }
}

// ==================== RENDER - DESTINATIONS ====================
function renderDestinations(category) {
    const grid = document.getElementById('destinationsGrid');
    if (!grid) return;

    grid.innerHTML = '';
    appState.currentFilter = category;

    const destinations = locationsData[appState.currentLocation] || [];
    const filtered = destinations.filter(d => category === 'all' || d.category === category);

    if (filtered.length === 0) {
        grid.innerHTML = '<p class="col-span-2 text-center text-slate-500 py-8">No destinations yet. Add one to get started!</p>';
        return;
    }

    filtered.forEach(dest => {
        const isSelected = appState.selected.some(s => s.id === dest.id);
        const card = createDestinationCard(dest, isSelected);
        grid.appendChild(card);
    });
}

function createDestinationCard(dest, isSelected) {
    const card = document.createElement('div');
    card.className = `destination-card group relative overflow-hidden rounded-[2rem] border-2 transition-all cursor-pointer ${
        isSelected ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-white'
    } shadow-sm hover:shadow-xl`;
    
    card.onclick = () => toggleDestination(dest);
    
    card.innerHTML = `
        <div class="relative h-52 overflow-hidden">
            <img src="${dest.image}" alt="${dest.name}" 
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
            <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            
            <!-- Category Badge -->
            <div class="absolute top-4 left-4">
                <span class="text-xs font-bold px-3 py-1 bg-white/90 text-slate-900 rounded-full capitalize">
                    ${dest.category}
                </span>
            </div>
            
            <!-- Price Badge -->
            <div class="absolute top-4 right-4">
                <div class="bg-white/90 px-3 py-1.5 rounded-full font-bold whitespace-nowrap">
                    ${dest.price === 0 ? '🆓 Free' : `₹${dest.price}`}
                </div>
            </div>

            <!-- Checkmark for selected -->
            ${isSelected ? `
                <div class="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-lg">✓</div>
            ` : ''}
        </div>
        
        <div class="p-6">
            <h3 class="text-lg font-bold text-slate-900">${dest.name}</h3>
            <p class="text-sm text-slate-600 mt-2 line-clamp-2">${dest.description}</p>
            
            <div class="mt-4 flex items-center justify-between text-xs text-slate-600">
                <span>⭐ ${dest.rating} (${dest.reviews})</span>
                <span>⏱️ ${dest.duration}</span>
            </div>
        </div>
    `;
    
    return card;
}

// ==================== CATEGORY FILTERING ====================
function filterDestinations(category, btn) {
    document.querySelectorAll('.category-pill').forEach(b => {
        b.classList.remove('active', 'bg-indigo-600', 'text-white');
        b.classList.add('text-slate-700', 'bg-white');
    });
    
    btn.classList.add('active', 'bg-indigo-600', 'text-white');
    btn.classList.remove('text-slate-700', 'bg-white');
    
    renderDestinations(category);
}

// ==================== DESTINATION SELECTION ====================
function toggleDestination(destination) {
    const index = appState.selected.findIndex(s => s.id === destination.id);

    if (index > -1) {
        appState.selected.splice(index, 1);
        appState.total -= destination.price;
    } else {
        appState.selected.push({
            id: destination.id,
            name: destination.name,
            price: destination.price,
            category: destination.category
        });
        appState.total += destination.price;
    }

    renderDestinations(appState.currentFilter);
    updateSummary();
}

// ==================== MEMBERS MANAGEMENT ====================
function adjustMembers(val) {
    const input = document.getElementById('memberInput');
    let newVal = parseInt(input.value) + val;
    newVal = Math.max(1, Math.min(20, newVal));
    input.value = newVal;
    appState.members = newVal;
    updateSummary();
}

// ==================== BUDGET MANAGEMENT ====================
function updateBudget(val) {
    document.getElementById('budgetValue').textContent = parseInt(val);
    checkBudget();
}

function checkBudget() {
    const budget = parseInt(document.getElementById('budgetRange').value);
    const alert = document.getElementById('budgetAlert');
    if (appState.total > budget) {
        alert.classList.remove('hidden');
    } else {
        alert.classList.add('hidden');
    }
}

// ==================== SUMMARY CALCULATION ====================
function updateSummary() {
    appState.members = parseInt(document.getElementById('memberInput').value) || 1;
    document.getElementById('spotCount').textContent = appState.selected.length;
    document.getElementById('totalCost').textContent = appState.total;
    const perPerson = appState.members > 0 ? Math.round(appState.total / appState.members) : 0;
    document.getElementById('perPersonCost').textContent = perPerson;
    checkBudget();
}

// ==================== ITINERARY ====================
function generateItinerary() {
    if (appState.selected.length === 0) {
        alert('📍 Please select at least one destination!');
        return;
    }

    const budget = parseInt(document.getElementById('budgetRange').value);
    if (appState.total > budget) {
        alert('⚠️ Budget exceeded! Remove some destinations.');
        return;
    }

    // Award points for booking
    const pointsEarned = appState.selected.length * 10 + Math.floor(appState.total / 50);
    currentUser.points += pointsEarned;
    
    // Record trip
    currentUser.trips.push({
        location: appState.currentLocation,
        destinations: appState.selected,
        total: appState.total,
        date: new Date(),
        points: pointsEarned
    });

    // Check for badges
    checkBadges();
    saveUserToStorage();
    updateUserPoints();

    const startPoint = document.getElementById('startPoint').value;
    const endPoint = document.getElementById('endPoint').value;
    const finalStop = endPoint === 'Back to Start' ? startPoint : endPoint;
    const perPerson = Math.round(appState.total / appState.members);
    const destinations = locationsData[appState.currentLocation] || [];

    let html = `
        <div class="flex items-center gap-4 mb-6 p-4 bg-indigo-50 rounded-xl">
            <div class="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">📍</div>
            <div>
                <p class="text-xs font-bold text-slate-600 uppercase">Starting</p>
                <p class="font-bold text-slate-900">${startPoint}</p>
            </div>
        </div>
    `;

    appState.selected.forEach((stop, idx) => {
        const dest = destinations.find(d => d.id === stop.id);
        if (!dest) return;
        html += `
            <div class="ml-5 pl-6 border-l-2 border-indigo-300 py-6 relative">
                <div class="absolute -left-[9px] top-8 w-4 h-4 rounded-full bg-indigo-600 border-4 border-white"></div>
                <div class="bg-white p-4 rounded-xl border border-slate-200">
                    <p class="font-bold text-slate-900">Stop ${idx + 1}: ${dest.name}</p>
                    <p class="text-xs text-slate-600 mt-2">⏱️ ${dest.duration} • 💰 ₹${dest.price}</p>
                </div>
            </div>
        `;
    });

    html += `
        <div class="flex items-center gap-4 mt-6 p-4 bg-green-50 rounded-xl">
            <div class="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">🏁</div>
            <div>
                <p class="text-xs font-bold text-slate-600 uppercase">Final</p>
                <p class="font-bold text-slate-900">${finalStop}</p>
            </div>
        </div>

        <div class="mt-8 pt-6 border-t-2 border-slate-200 space-y-4">
            <div class="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span class="text-slate-700 font-medium">Total (${appState.members} members)</span>
                <span class="font-black text-lg">₹${appState.total}</span>
            </div>
            <div class="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-2xl border-2 border-indigo-300">
                <p class="text-xs font-bold text-indigo-600 uppercase">Per Person</p>
                <p class="text-4xl font-black text-indigo-700">₹${perPerson}</p>
            </div>
            <div class="bg-gradient-to-br from-yellow-50 to-orange-100 p-6 rounded-2xl border-2 border-yellow-300">
                <p class="text-xs font-bold text-yellow-600 uppercase">Points Earned</p>
                <p class="text-2xl font-black text-yellow-700">+${pointsEarned} 🎉</p>
            </div>
        </div>
    `;

    document.getElementById('itineraryContent').innerHTML = html;
    document.getElementById('itineraryModal').classList.remove('hidden');
}

function closeItinerary() {
    document.getElementById('itineraryModal').classList.add('hidden');
}

// ==================== BOOKING MODAL ====================
function toggleBookingForm() {
    document.getElementById('bookingModal').classList.remove('hidden');
}

function handleBooking(e) {
    e.preventDefault();
    const btn = document.getElementById('bookingBtn');
    const successMsg = document.getElementById('bookingSuccess');
    btn.disabled = true;
    btn.textContent = '⏱️ Sending...';
    setTimeout(() => {
        btn.style.display = 'none';
        successMsg.classList.remove('hidden');
        setTimeout(() => {
            btn.style.display = 'block';
            btn.textContent = 'Get Call Back';
            btn.disabled = false;
            successMsg.classList.add('hidden');
            e.target.reset();
            document.getElementById('bookingModal').classList.add('hidden');
        }, 2000);
    }, 1000);
}

// ==================== RATING SYSTEM ====================
function setRate(val) {
    const btns = document.querySelectorAll('#starContainer button');
    btns.forEach((b, i) => {
        if (i < val) b.classList.remove('grayscale');
        else b.classList.add('grayscale');
    });
    const msgs = ['😢 Keep going!', '😕 We\'ll do better!', '😊 Nice!', '😄 Great!', '🤩 Love You!'];
    document.getElementById('rateLabel').textContent = msgs[val - 1];
}

// ==================== BADGES & POINTS ====================
function checkBadges() {
    const trips = currentUser.trips.length;
    const visitedCount = new Set(currentUser.trips.map(t => t.location)).size;
    const totalPoints = currentUser.points;
    
    const destinationsByCategory = {};
    currentUser.trips.forEach(trip => {
        trip.destinations.forEach(dest => {
            const category = dest.category || 'other';
            destinationsByCategory[category] = (destinationsByCategory[category] || 0) + 1;
        });
    });

    // Check each badge criteria
    if (currentUser.trips.length >= 5 && !currentUser.badges.includes('explorer')) {
        currentUser.badges.push('explorer');
    }
    if ((destinationsByCategory['food'] || 0) >= 3 && !currentUser.badges.includes('foodie')) {
        currentUser.badges.push('foodie');
    }
    if ((destinationsByCategory['nature'] || 0) >= 3 && !currentUser.badges.includes('nature_lover')) {
        currentUser.badges.push('nature_lover');
    }
    if ((destinationsByCategory['heritage'] || 0) >= 5 && !currentUser.badges.includes('heritage_guardian')) {
        currentUser.badges.push('heritage_guardian');
    }
    if (totalPoints >= 500 && !currentUser.badges.includes('points_collector')) {
        currentUser.badges.push('points_collector');
    }
    if (trips >= 10 && !currentUser.badges.includes('travel_master')) {
        currentUser.badges.push('travel_master');
    }
}

function updateUserPoints() {
    document.getElementById('userPoints').textContent = currentUser.points;
}

function showUserProfile() {
    checkBadges(); // Recheck badges
    const tripsCount = currentUser.trips.length;
    const locationCount = new Set(currentUser.trips.map(t => t.location)).size;

    // Update profile modal with data
    document.getElementById('profileName').textContent = `👤 ${currentUser.name} (${currentUser.email})`;
    document.getElementById('profilePoints').textContent = currentUser.points;
    document.getElementById('profileTrips').textContent = tripsCount;
    document.getElementById('profileBadges').textContent = currentUser.badges.length;

    // Populate badges
    const badgesList = document.getElementById('profileBadgesList');
    badgesList.innerHTML = '';
    Object.entries(badgesDefinition).forEach(([key, badge]) => {
        const earned = currentUser.badges.includes(key);
        const badgeEl = document.createElement('div');
        badgeEl.className = `p-3 rounded-lg border-2 text-center ${earned ? 'bg-yellow-50 border-yellow-300' : 'bg-slate-50 border-slate-200 opacity-50'}`;
        badgeEl.innerHTML = `
            <p class="text-xl">${badge.name}</p>
            <p class="text-xs text-slate-600 mt-1">${badge.description}</p>
            ${earned ? '<p class="text-xs font-bold text-yellow-600 mt-2">✓ EARNED</p>' : '<p class="text-xs font-bold text-slate-400 mt-2">○ LOCKED</p>'}
        `;
        badgesList.appendChild(badgeEl);
    });

    // Populate trip history
    const tripsList = document.getElementById('profileTripsList');
    tripsList.innerHTML = '';
    if (currentUser.trips.length === 0) {
        tripsList.innerHTML = '<p class="text-slate-600 text-sm text-center py-4">No trips yet. Build an itinerary to start!</p>';
    } else {
        currentUser.trips.forEach((trip, idx) => {
            const tripEl = document.createElement('div');
            tripEl.className = 'bg-slate-50 p-3 rounded-lg border border-slate-200';
            tripEl.innerHTML = `
                <p class="font-bold text-slate-900">Trip ${idx + 1} - ${trip.location}</p>
                <p class="text-xs text-slate-600 mt-1">📍 ${trip.destinations.length} destinations | 💰 ₹${trip.total} | ⭐ +${trip.points} pts</p>
                <p class="text-xs text-slate-500 mt-1">${new Date(trip.date).toLocaleDateString()}</p>
            `;
            tripsList.appendChild(tripEl);
        });
    }

    // Show modal
    document.getElementById('profileModal').classList.remove('hidden');
}

function closeProfile() {
    document.getElementById('profileModal').classList.add('hidden');
}

function showAddDestinationModal() {
    if (mightBeCustomLocation(appState.currentLocation)) {
        document.getElementById('destLocationName').textContent = `For ${appState.currentLocation}`;
        document.getElementById('addDestinationModal').classList.remove('hidden');
    } else {
        alert('You can only add destinations to custom locations!');
    }
}

function mightBeCustomLocation(location) {
    // Check if it's not a predefined location
    return !['Indore', 'Bhopal', 'Ujjain', 'Omkareshwar'].includes(location);
}

function closeAddDestinationModal() {
    document.getElementById('addDestinationModal').classList.add('hidden');
    document.getElementById('destName').value = '';
    document.getElementById('destCategory').value = 'heritage';
    document.getElementById('destPrice').value = '0';
    document.getElementById('destDuration').value = '';
}

function handleAddDestination(event) {
    event.preventDefault();
    const name = document.getElementById('destName').value;
    const category = document.getElementById('destCategory').value;
    const price = parseInt(document.getElementById('destPrice').value);
    const duration = document.getElementById('destDuration').value;

    // Create new destination
    const newDest = {
        id: 'custom_' + Date.now(),
        name: name,
        category: category,
        description: 'User-added destination',
        duration: duration,
        rating: 4.5,
        reviews: 1,
        price: price,
        image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=600'
    };

    // Add to the location
    if (!locationsData[appState.currentLocation]) {
        locationsData[appState.currentLocation] = [];
    }
    locationsData[appState.currentLocation].push(newDest);

    // Save and refresh
    currentUser.customLocations = Object.keys(locationsData).filter(loc => !['Indore', 'Bhopal', 'Ujjain', 'Omkareshwar'].includes(loc));
    saveUserToStorage();

    alert('✓ Destination added to ' + appState.currentLocation + '!');
    closeAddDestinationModal();
    renderDestinations(appState.currentFilter);
}

function showTab(tab) {
    // This handles navigation tab clicks
    if (tab === 'profile') {
        showUserProfile();
    } else if (tab === 'dashboard') {
        console.log('Dashboard tab selected');
    } else if (tab === 'explore') {
        console.log('Explore tab selected');
    }
}
