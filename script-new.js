/**
 * Indore Explorer - Budget Planner
 * Modern React-aligned Architecture
 * State, Rendering, and Event Management
 */

// ==================== STATE ====================
let appState = {
    selected: [],
    total: 0,
    members: 1,
    currentFilter: 'all'
};

// Destinations data (matching React Explore component structure)
const destinations = [
    {
        id: '1',
        name: 'Rajwada Palace',
        category: 'heritage',
        description: 'Historic royal palace with stunning Indo-Saracenic architecture',
        duration: '1-2 hours',
        rating: 4.8,
        reviews: 2543,
        price: 350,
        image: 'https://images.unsplash.com/photo-1595928642581-f50f4f3453a5?auto=format&fit=crop&q=80&w=600'
    },
    {
        id: '2',
        name: 'Chappan Dukan',
        category: 'food',
        description: 'Famous food street with 56 shops offering local delicacies',
        duration: '2-3 hours',
        rating: 4.6,
        reviews: 3142,
        price: 180,
        image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&q=80&w=600'
    },
    {
        id: '3',
        name: 'Khajrana Ganesh',
        category: 'heritage',
        description: 'Revered temple dedicated to Lord Ganesha. Most powerful spiritual spot.',
        duration: '45 mins',
        rating: 4.9,
        reviews: 4287,
        price: 0,
        image: 'https://images.unsplash.com/photo-1544011501-a9917d16ba4d?auto=format&fit=crop&q=80&w=600'
    },
    {
        id: '4',
        name: 'Lotus Valley',
        category: 'nature',
        description: 'Serene natural valley with beautiful lotus ponds. Perfect for photography.',
        duration: '1.5 hours',
        rating: 4.7,
        reviews: 1856,
        price: 250,
        image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=600'
    }
];

// ==================== LIFECYCLE ====================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Indore Explorer initialized');
    renderDestinations('all');
    updateSummary();
});

// ==================== RENDER - DESTINATIONS ====================
function renderDestinations(category) {
    const grid = document.getElementById('destinationsGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    appState.currentFilter = category;

    const filtered = destinations.filter(d => 
        category === 'all' || d.category === category
    );

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
    // Update UI state
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
        // Remove from selection
        appState.selected.splice(index, 1);
        appState.total -= destination.price;
    } else {
        // Add to selection
        appState.selected.push({
            id: destination.id,
            name: destination.name,
            price: destination.price
        });
        appState.total += destination.price;
    }
    
    // Re-render to show selection state
    renderDestinations(appState.currentFilter);
    updateSummary();
}

// ==================== MEMBERS MANAGEMENT ====================
function adjustMembers(val) {
    const input = document.getElementById('memberInput');
    let newVal = parseInt(input.value) + val;
    
    // Clamp between 1 and 20
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
    
    // Update counts
    document.getElementById('spotCount').textContent = appState.selected.length;
    document.getElementById('totalCost').textContent = appState.total;
    
    // Calculate per-person cost
    const perPerson = appState.members > 0 ? Math.round(appState.total / appState.members) : 0;
    document.getElementById('perPersonCost').textContent = perPerson;
    
    checkBudget();
}

// ==================== ITINERARY GENERATION ====================
function generateItinerary() {
    // Validation
    if (appState.selected.length === 0) {
        alert('📍 Please select at least one destination!');
        return;
    }
    
    const budget = parseInt(document.getElementById('budgetRange').value);
    if (appState.total > budget) {
        alert('⚠️ You are over budget! Increase your budget or remove some destinations.');
        return;
    }

    // Get route details
    const startPoint = document.getElementById('startPoint').value;
    const endPoint = document.getElementById('endPoint').value;
    const finalStop = endPoint === 'Back to Start' ? startPoint : endPoint;
    const perPerson = Math.round(appState.total / appState.members);

    // Build itinerary HTML
    let html = generateItineraryHTML(startPoint, finalStop, perPerson);

    // Display modal
    document.getElementById('itineraryContent').innerHTML = html;
    document.getElementById('itineraryModal').classList.remove('hidden');
}

function generateItineraryHTML(startPoint, finalStop, perPerson) {
    let html = `
        <div class="flex items-center gap-4 mb-6 p-4 bg-indigo-50 rounded-xl">
            <div class="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">📍</div>
            <div>
                <p class="text-xs font-bold text-slate-600 uppercase tracking-wider">Starting Point</p>
                <p class="font-bold text-slate-900 text-lg">${startPoint}</p>
            </div>
        </div>
    `;

    // Add stops
    appState.selected.forEach((stop, idx) => {
        const dest = destinations.find(d => d.id === stop.id);
        if (!dest) return;
        
        html += `
            <div class="ml-5 pl-6 border-l-2 border-indigo-300 py-6 relative">
                <div class="absolute -left-[9px] top-8 w-4 h-4 rounded-full bg-indigo-600 border-4 border-white"></div>
                <div class="bg-white p-4 rounded-xl border border-slate-200">
                    <p class="font-bold text-slate-900">Stop ${idx + 1}: ${dest.name}</p>
                    <p class="text-xs text-slate-600 mt-2">
                        <span class="inline-block mr-4">⏱️ ${dest.duration}</span>
                        <span class="inline-block">💰 ₹${dest.price}</span>
                    </p>
                </div>
            </div>
        `;
    });

    // Add final destination
    html += `
        <div class="flex items-center gap-4 mt-6 p-4 bg-green-50 rounded-xl">
            <div class="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">🏁</div>
            <div>
                <p class="text-xs font-bold text-slate-600 uppercase tracking-wider">Final Destination</p>
                <p class="font-bold text-slate-900 text-lg">${finalStop}</p>
            </div>
        </div>

        <div class="mt-8 pt-6 border-t-2 border-slate-200 space-y-4">
            <div class="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span class="text-slate-700 font-medium">Total Cost (${appState.members} members)</span>
                <span class="font-black text-lg text-slate-900">₹${appState.total}</span>
            </div>
            <div class="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-2xl border-2 border-indigo-300">
                <p class="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">💰 Per Person</p>
                <p class="text-4xl font-black text-indigo-700">₹${perPerson}</p>
                <p class="text-xs text-indigo-600 mt-2">Each member pays ₹${perPerson}</p>
            </div>
        </div>
    `;

    return html;
}

function closeItinerary() {
    document.getElementById('itineraryModal').classList.add('hidden');
}

// ==================== BOOKING MODAL ====================
function toggleBookingForm() {
    document.getElementById('bookingModal').classList.remove('hidden');
}

function closeBookingModal() {
    document.getElementById('bookingModal').classList.add('hidden');
}

function handleBooking(e) {
    e.preventDefault();
    const btn = document.getElementById('bookingBtn');
    const successMsg = document.getElementById('bookingSuccess');
    
    btn.disabled = true;
    btn.textContent = '⏱️ Sending...';
    
    // Simulate API call
    setTimeout(() => {
        btn.style.display = 'none';
        successMsg.classList.remove('hidden');
        console.log('✓ Booking form submitted');
        
        // Reset after success message
        setTimeout(() => {
            btn.style.display = 'block';
            btn.textContent = 'Get Call Back';
            btn.disabled = false;
            successMsg.classList.add('hidden');
            
            // Reset form
            e.target.reset();
            closeBookingModal();
        }, 2000);
    }, 1000);
}

// ==================== RATING SYSTEM ====================
function setRate(val) {
    const btns = document.querySelectorAll('#starContainer button');
    btns.forEach((b, i) => {
        if (i < val) {
            b.classList.remove('grayscale');
        } else {
            b.classList.add('grayscale');
        }
    });
    
    const messages = [
        '😢 Keep going!',
        '😕 We\'ll do better!',
        '😊 Nice!',
        '😄 Great choice!',
        '🤩 Indore Loves You!'
    ];
    document.getElementById('rateLabel').textContent = messages[val - 1];
}

// ==================== UTILS ====================
console.log('✅ Indore Explorer Script Loaded');
