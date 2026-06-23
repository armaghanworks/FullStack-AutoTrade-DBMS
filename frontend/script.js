// ===== THEME TOGGLE LOGIC =====
        const themeToggle = document.getElementById('themeToggle');
        const htmlElement = document.documentElement;

        // Respect system preference or saved choice
        const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
        const savedTheme = localStorage.getItem('theme') || (prefersLight ? 'light' : 'dark');

        if (savedTheme === 'light') {
            htmlElement.classList.add('light-theme');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        } else {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }

        themeToggle.addEventListener('click', () => {
            htmlElement.classList.toggle('light-theme');
            const isLight = htmlElement.classList.contains('light-theme');
            themeToggle.innerHTML = isLight 
                ? '<i class="fas fa-moon"></i>' 
                : '<i class="fas fa-sun"></i>';
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
        });

        // ===== REST OF YOUR JS CODE =====
        const state = {
            currentUser: null,
            currentView: 'home',
            selectedCategory: 'all',
            searchQuery: '',
            ads: [],
            userLocation: null
        };

        let sampleLocations = {
            'Gulshan-e-Iqbal, Karachi, Pakistan': { lat: 24.9430, lng: 67.1160 },
            'DHA Phase 5, Karachi, Pakistan': { lat: 24.8230, lng: 67.0630 },
            'Nazimabad, Karachi, Pakistan': { lat: 24.9208, lng: 67.0335 },
            'Bahria Town, Karachi, Pakistan': { lat: 24.8500, lng: 67.1300 },
            'Gulberg III, Lahore, Pakistan': { lat: 31.5300, lng: 74.3435 },
            'Model Town, Lahore, Pakistan': { lat: 31.5830, lng: 74.3440 },
            'F-8 Markaz, Islamabad, Pakistan': { lat: 33.7200, lng: 73.0780 },
            'H-8, Islamabad, Pakistan': { lat: 33.6770, lng: 73.0380 },
            'I-8, Islamabad, Pakistan': { lat: 33.6600, lng: 73.0250 },
            'Soan Gardens, Zone V, Islamabad Capital Territory, Pakistan': { lat: 33.56183, lng: 73.15106 },
            'Karachi, Pakistan': { lat: 24.8607, lng: 67.0011 },
            'Lahore, Pakistan': { lat: 31.5204, lng: 74.3587 },
            'Islamabad, Pakistan': { lat: 33.6844, lng: 73.0479 },
            'Rawalpindi, Pakistan': { lat: 33.5923, lng: 73.0509 },
            'Faisalabad, Pakistan': { lat: 31.4504, lng: 73.1350 }
        };

        const demoAds = [
            {
                id: 1,
                title: 'Lamborghini Huracán',
                category: 'car',
                price: 32000000,
                year: 2023,
                kilometers: 5000,
                description: 'Pristine white Lamborghini Huracán with full service history. Premium luxury sports car with incredible performance.',
                image: 'https://images.unsplash.com/photo-1742056024244-02a093dae0b5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBzcG9ydHMlMjBjYXJ8ZW58MHx8fHwxNzY1NTE2NTMzfDA&ixlib=rb-4.1.0&q=85',
                fuel: 'Petrol',
                seller: 'Armaghan',
                sellerSince: '2022',
                location: 'Gulshan-e-Iqbal, Karachi, Pakistan'
            },
            {
                id: 2,
                title: 'Mercedes-AMG GT',
                category: 'car',
                price: 28500000,
                year: 2023,
                kilometers: 3200,
                description: 'Stunning white Mercedes-AMG GT in showroom condition. Perfect blend of luxury and performance.',
                image: 'https://images.unsplash.com/photo-1698543252450-463b8b16e567?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwyfHxsdXh1cnklMjBzcG9ydHMlMjBjYXJ8ZW58MHx8fHwxNzY1NTE2NTMzfDA&ixlib=rb-4.1.0&q=85',
                fuel: 'Petrol',
                seller: 'Roman',
                sellerSince: '2021',
                location: 'DHA Phase 5, Karachi, Pakistan'
            },
            {
                id: 3,
                title: 'BMW M4 Competition',
                category: 'car',
                price: 18500000,
                year: 2022,
                kilometers: 8500,
                description: 'Gorgeous purple BMW M4 Competition. Exceptional handling and luxury combined in one stunning package.',
                image: 'https://images.unsplash.com/photo-1698543252507-cd8c187212e2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwzfHxsdXh1cnklMjBzcG9ydHMlMjBjYXJ8ZW58MHx8fHwxNzY1NTE2NTMzfDA&ixlib=rb-4.1.0&q=85',
                fuel: 'Petrol',
                seller: 'Armaghan',
                sellerSince: '2022',
                location: 'F-8 Markaz, Islamabad, Pakistan'
            },
            {
                id: 4,
                title: 'Yamaha YZF-R1',
                category: 'bike',
                price: 3500000,
                year: 2023,
                kilometers: 1200,
                description: 'Premium Yamaha superbike with cutting-edge technology. Perfect condition with full documentation.',
                image: 'https://images.unsplash.com/photo-1762012507866-ef40646195c0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwbW90b3JjeWNsZXxlbnwwfHx8fDE3NjU1MTY1NzJ8MA&ixlib=rb-4.1.0&q=85',
                fuel: 'Petrol',
                seller: 'Roman',
                sellerSince: '2021',
                location: 'H-8, Islamabad, Pakistan'
            },
            {
                id: 5,
                title: 'Ducati Panigale V4',
                category: 'bike',
                price: 4200000,
                year: 2023,
                kilometers: 800,
                description: 'Stunning Ducati Panigale V4 in pristine condition. Italian engineering at its finest.',
                image: 'https://images.unsplash.com/photo-1677587690975-20d44c7e6d31?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwyfHxwcmVtaXVtJTIwbW90b3JjeWNsZXxlbnwwfHx8fDE3NjU1MTY1NzJ8MA&ixlib=rb-4.1.0&q=85',
                fuel: 'Petrol',
                seller: 'Armaghan',
                sellerSince: '2022',
                location: 'Gulberg III, Lahore, Pakistan'
            },
            {
                id: 6,
                title: 'Ducati 959 Panigale',
                category: 'bike',
                price: 3800000,
                year: 2022,
                kilometers: 2500,
                description: 'White Ducati 959 Panigale with exceptional performance. Well-maintained and ready to ride.',
                image: 'https://images.unsplash.com/photo-1759001186046-8953f3899d7f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxwcmVtaXVtJTIwbW90b3JjeWNsZXxlbnwwfHx8fDE3NjU1MTY1NzJ8MA&ixlib=rb-4.1.0&q=85',
                fuel: 'Petrol',
                seller: 'Roman',
                sellerSince: '2021',
                location: 'H-8, Islamabad, Pakistan'
            },
            {
                id: 7,
                title: 'Toyota Corolla GLi',
                category: 'car',
                price: 4500000,
                year: 2021,
                kilometers: 35000,
                description: 'Well-maintained Corolla with full service history. Fuel-efficient and reliable.',
                image: 'https://cache4.pakwheels.com/ad_pictures/1334/toyota-corolla-altis-grande-x-cvt-i-1-8-black-interior-2021-133444344.webp',
                fuel: 'Petrol',
                seller: 'Armaghan',
                sellerSince: '2022',
                location: 'Nazimabad, Karachi, Pakistan'
            },
            {
                id: 8,
                title: 'Honda Civic Reborn',
                category: 'car',
                price: 6200000,
                year: 2022,
                kilometers: 22000,
                description: 'Like-new Honda Civic with premium audio and alloy wheels.',
                image: 'https://propakistani.pk/wp-content/uploads/2021/04/2022-honda-civic-sedan-touring-front-three-quarters-1618350668-e1618473947253.jpg',
                fuel: 'Petrol',
                seller: 'Roman',
                sellerSince: '2021',
                location: 'Model Town, Lahore, Pakistan'
            },
            {
                id: 9,
                title: 'Suzuki Alto VX',
                category: 'car',
                price: 1800000,
                year: 2020,
                kilometers: 40000,
                description: 'City-friendly Alto in excellent condition. Low mileage and fuel saver.',
                image: 'https://autos.hamariweb.com/images/carimages/car_7411_062979.jpg',
                fuel: 'Petrol',
                seller: 'Armaghan',
                sellerSince: '2022',
                location: 'I-8, Islamabad, Pakistan'
            },
            {
                id: 10,
                title: 'Kawasaki Ninja 400',
                category: 'bike',
                price: 2800000,
                year: 2023,
                kilometers: 500,
                description: 'Brand new Ninja 400 with zero scratches. Perfect for beginners and pros.',
                image: 'https://cdn.bikedekho.com/processedimages/kawasaki/ninja-400/640X309/ninja-40062b2b760470d9.jpg',
                fuel: 'Petrol',
                seller: 'Roman',
                sellerSince: '2021',
                location: 'Bahria Town, Karachi, Pakistan'
            }
        ];

        function debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }

        async function searchLocations(query) {
            if (!query.trim()) return [];
            try {
                const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query + ', Pakistan')}&format=json&addressdetails=1&limit=6&countrycodes=pk`;
                const response = await fetch(url, {
                    headers: {
                        'User-Agent': 'AutoTrade/1.0 (contact@example.com)'
                    }
                });
                const data = await response.json();
                return data
                    .filter(place => place.address?.country === "Pakistan")
                    .map(place => place.display_name);
            } catch (error) {
                console.warn("Location search failed:", error);
                return [];
            }
        }

        function showSuggestions(suggestions) {
            const container = document.getElementById('locationSuggestions');
            if (!container) return;
            container.innerHTML = '';
            if (suggestions.length === 0) {
                container.style.display = 'none';
                return;
            }
            suggestions.forEach(place => {
                const el = document.createElement('div');
                el.textContent = place;
                el.onclick = () => {
                    document.getElementById('adLocation').value = place;
                    container.style.display = 'none';
                };
                container.appendChild(el);
            });
            container.style.display = 'block';
        }

        function initLocationAutocomplete() {
            const input = document.getElementById('adLocation');
            if (!input) return;
            document.addEventListener('click', (e) => {
                const suggestions = document.getElementById('locationSuggestions');
                if (!input.contains(e.target) && suggestions && !suggestions.contains(e.target)) {
                    suggestions.style.display = 'none';
                }
            });
            const debouncedSearch = debounce(async (query) => {
                const results = await searchLocations(query);
                showSuggestions(results);
            }, 300);
            input.addEventListener('input', (e) => debouncedSearch(e.target.value));
        }

        async function searchLocationsForFilter(query) {
            if (!query.trim()) return [];
            try {
                const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query + ', Pakistan')}&format=json&addressdetails=1&limit=5&countrycodes=pk`;
                const res = await fetch(url, { headers: { 'User-Agent': 'AutoTrade/1.0' } });
                const data = await res.json();
                return data.map(place => place.display_name);
            } catch (err) {
                console.warn("Location search failed:", err);
                return [];
            }
        }

        function showLocationSearchSuggestions(suggestions) {
            const container = document.getElementById('locationSearchSuggestions');
            if (!container) return;
            container.innerHTML = '';
            if (suggestions.length === 0) {
                container.style.display = 'none';
                return;
            }
            suggestions.forEach(place => {
                const el = document.createElement('div');
                el.style.padding = '0.5rem 1rem';
                el.style.cursor = 'pointer';
                el.style.borderBottom = '1px solid hsl(var(--border))';
                el.textContent = place;
                el.onclick = () => {
                    document.getElementById('locationSearchInput').value = place;
                    container.style.display = 'none';
                    searchVehiclesByLocation(); 
                };
                el.onmouseenter = () => el.style.background = 'hsl(var(--primary) / 0.1)';
                el.onmouseleave = () => el.style.background = '';
                container.appendChild(el);
            });
            container.style.display = 'block';
        }

        document.addEventListener('click', (e) => {
            const input = document.getElementById('locationSearchInput');
            const dropdown = document.getElementById('locationSearchSuggestions');
            if (input && dropdown && !input.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.style.display = 'none';
            }
        });

        const debouncedLocationSearch = debounce(async (query) => {
            const results = await searchLocationsForFilter(query);
            showLocationSearchSuggestions(results);
        }, 300);

        document.addEventListener('DOMContentLoaded', () => {
            const locationInput = document.getElementById('locationSearchInput');
            if (locationInput) {
                locationInput.addEventListener('input', (e) => debouncedLocationSearch(e.target.value));
            }
        });

        function init() {
            state.ads = [...demoAds];
            renderAds();
            if ("geolocation" in navigator) {
            } else {
                console.warn("Geolocation is not supported by this browser.");
            }
        }

        function clearLocationInput() {
            const input = document.getElementById('locationSearchInput');
            if (input) {
                input.value = '';
                toggleLocationClearBtn();
                input.focus();
            }
        }

        function toggleLocationClearBtn() {
            const input = document.getElementById('locationSearchInput');
            const btn = document.getElementById('locationClearBtn');
            if (input && btn) {
                btn.style.display = input.value ? 'block' : 'none';
            }
        }

        function clearSearchInput() {
            const input = document.getElementById('searchInput');
            if (input) {
                input.value = '';
                toggleSearchClearBtn();
                input.focus();
            }
        }

        function toggleSearchClearBtn() {
            const input = document.getElementById('searchInput');
            const btn = document.getElementById('searchClearBtn');
            if (input && btn) {
                btn.style.display = input.value ? 'block' : 'none';
            }
        }

        function calculateDistance(lat1, lng1, lat2, lng2) {
            const R = 6371;
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLng = (lng2 - lng1) * Math.PI / 180;
            const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLng / 2) * Math.sin(dLng / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const distance = R * c; 
            return distance;
        }

        class ListNode {
            constructor(data) {
                this.data = data;
                this.next = null;
            }
        }

        class LinkedList {
            constructor() {
                this.head = null;
                this.size = 0;
            }
            append(data) {
                const newNode = new ListNode(data);
                if (!this.head) {
                    this.head = newNode;
                } else {
                    let current = this.head;
                    while (current.next) {
                        current = current.next;
                    }
                    current.next = newNode;
                }
                this.size++;
            }
            toArray() {
                const result = [];
                let current = this.head;
                while (current) {
                    result.push(current.data);
                    current = current.next;
                }
                return result;
            }
        }

        class BSTNode {
            constructor(key, value) {
                this.key = key;
                this.value = value;
                this.left = null;
                this.right = null;
            }
        }

        class BinarySearchTree {
            constructor() {
                this.root = null;
            }
            insert(key, value) {
                this.root = this._insertRecursive(this.root, key, value);
            }
            _insertRecursive(node, key, value) {
                if (!node) {
                    return new BSTNode(key, value);
                }
                if (key < node.key) {
                    node.left = this._insertRecursive(node.left, key, value);
                } else {
                    node.right = this._insertRecursive(node.right, key, value);
                }
                return node;
            }
            inOrderTraversal() {
                const result = [];
                this._inOrderRecursive(this.root, result);
                return result;
            }
            _inOrderRecursive(node, result) {
                if (node) {
                    this._inOrderRecursive(node.left, result);
                    result.push(node.value);
                    this._inOrderRecursive(node.right, result);
                }
            }
        }

        function showNearbyVehicles() {
            state.userLocation = null;
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        state.userLocation = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        };
                        findNearbyVehicles();
                    },
                    (error) => {
                        showToast('Location access denied. Please enable location services to see nearby vehicles.', 'error');
                        state.selectedCategory = 'all';
                        state.currentView = 'home';
                        renderAds();
                    }
                );
            } else {
                showToast('Geolocation is not supported by your browser.', 'error');
                state.selectedCategory = 'all';
                state.currentView = 'home';
                renderAds();
            }
        }

        function findNearbyVehicles() {
            const vehicleList = new LinkedList();
            state.ads.forEach(ad => {
                const adLocation = sampleLocations[ad.location];
                if (adLocation) {
                    const distance = calculateDistance(
                        state.userLocation.lat,
                        state.userLocation.lng,
                        adLocation.lat,
                        adLocation.lng
                    );
                    if (distance <= 20) {
                        const adWithDistance = { ...ad, distance };
                        vehicleList.append(adWithDistance);
                    }
                }
            });

            if (!vehicleList.head) {
                state.currentView = 'nearby';
                state.selectedCategory = 'nearby';
                renderEmptyNearbyState();
                return;
            }

            const vehicleBST = new BinarySearchTree();
            const vehiclesArray = vehicleList.toArray();
            vehiclesArray.forEach(vehicle => {
                vehicleBST.insert(vehicle.distance, vehicle);
            });

            const sortedVehicles = vehicleBST.inOrderTraversal();
            state.currentView = 'nearby';
            state.selectedCategory = 'nearby';
            renderNearbyAds(sortedVehicles);
        }

        function renderNearbyAds(vehicles) {
            const adsGrid = document.getElementById('adsGrid');
            const sectionTitle = document.getElementById('sectionTitle');
            sectionTitle.textContent = 'Vehicles Near You (Within 20km)';
            adsGrid.innerHTML = '';
            vehicles.forEach(ad => {
                const adCard = document.createElement('div');
                adCard.className = 'ad-card';
                adCard.innerHTML = `
    <img src="${ad.image}" alt="${ad.title}" class="ad-image" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23262626%22 width=%22400%22 height=%22300%22/%3E%3Ctext fill=%22%23666%22 font-family=%22sans-serif%22 font-size=%2224%22 dy=%2210.5%22 font-weight=%22bold%22 x=%2250%%22 y=%2250%%22 text-anchor=%22middle%22%3E${ad.title}%3C/text%3E%3C/svg%3E'">
    <div class="ad-content">
        <h3 class="ad-title">${ad.title}</h3>
        <div class="ad-price">Rs ${ad.price.toLocaleString()}</div>
        <div class="ad-meta">
            <span><i class="fas fa-calendar"></i> ${ad.year}</span>
            <span><i class="fas fa-tachometer-alt"></i> ${ad.kilometers.toLocaleString()} km</span>
            <div class="distance-badge">${ad.distance.toFixed(1)} km away</div>
        </div>
        <p class="ad-description">${ad.description}</p>
        <div class="ad-actions">
            <button class="btn btn-primary" onclick="viewAdDetail(${ad.id})">
                <i class="fas fa-eye"></i> View Details
            </button>
            <button class="btn btn-outline" onclick="contactSeller(${ad.id})">
                <i class="fas fa-phone"></i> Contact
            </button>
            ${(state.currentUser && (String(ad.user_id) === String(state.currentUser.id) || (ad.seller && state.currentUser.username && ad.seller.toLowerCase() === state.currentUser.username.toLowerCase()))) ?
                `<div style="display:flex;gap:0.4rem;flex-wrap:wrap;margin-top:0.5rem;width:100%;">
                    <button class="btn btn-outline" style="font-size:0.78rem;padding:0.35rem 0.6rem;border-color:hsl(var(--accent));color:hsl(var(--accent));flex:1;" onclick="showEditForm(${ad.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-outline" style="font-size:0.78rem;padding:0.35rem 0.6rem;border-color:#f59e0b;color:#f59e0b;flex:1;" onclick="typeof markAdStatusDB!=='undefined'?markAdStatusDB(${ad.id},'sold'):alert('db-api.js not loaded')">
                        <i class="fas fa-handshake"></i> Sold
                    </button>
                    <button class="btn btn-outline" style="font-size:0.78rem;padding:0.35rem 0.6rem;border-color:#6b7280;color:#9ca3af;flex:1;" onclick="typeof markAdStatusDB!=='undefined'?markAdStatusDB(${ad.id},'inactive'):alert('db-api.js not loaded')">
                        <i class="fas fa-eye-slash"></i> Deactivate
                    </button>
                    <button class="btn btn-outline" style="font-size:0.78rem;padding:0.35rem 0.6rem;border-color:#ef4444;color:#ef4444;" onclick="deleteAd(${ad.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>` : ''}
        </div>
    </div>
`;
                adsGrid.appendChild(adCard);
            });
            document.querySelectorAll('.tab').forEach(tab => {
                tab.classList.remove('active');
                if (tab.dataset.category === 'nearby') {
                    tab.classList.add('active');
                }
            });
            updateActiveNavLink();
        }

        function renderEmptyNearbyState() {
            const adsGrid = document.getElementById('adsGrid');
            const sectionTitle = document.getElementById('sectionTitle');
            sectionTitle.textContent = 'Vehicles Near You (Within 20km)';
            adsGrid.innerHTML = `
                <div class="empty-state" style="grid-column: 1/-1;">
                    <i class="fas fa-car-side"></i>
                    <p>No vehicles found within 20km of your location.</p>
                    <button class="btn btn-outline" onclick="filterByCategory('all')">
                        View All Vehicles
                    </button>
                </div>
            `;
            document.querySelectorAll('.tab').forEach(tab => {
                tab.classList.remove('active');
                if (tab.dataset.category === 'nearby') {
                    tab.classList.add('active');
                }
            });
            updateActiveNavLink();
        }

        function renderAds() {
            if (state.currentView === 'nearby') {
                return;
            }
            const adsGrid = document.getElementById('adsGrid');
            let filteredAds = [...state.ads];
            if (state.selectedCategory !== 'all' && state.currentView === 'home') {
                filteredAds = filteredAds.filter(ad => ad.category === state.selectedCategory);
            }
            if (state.searchQuery) {
                const query = state.searchQuery.toLowerCase();
                filteredAds = filteredAds.filter(ad =>
                    ad.title.toLowerCase().includes(query) ||
                    ad.description.toLowerCase().includes(query) ||
                    ad.seller.toLowerCase().includes(query) ||
                    ad.year.toString().includes(query)
                );
            }
            if (state.currentView === 'myPosts' && state.currentUser) {
                filteredAds = filteredAds.filter(ad => ad.seller === state.currentUser.username);
            }
            adsGrid.innerHTML = '';
            if (filteredAds.length === 0) {
                adsGrid.innerHTML = `
                    <div class="empty-state" style="grid-column: 1/-1;">
                        <i class="fas fa-car-side"></i>
                        <p>No vehicles found matching your criteria.</p>
                        ${state.currentUser ? '<button class="btn btn-primary" onclick="showPublishForm()">Publish Your First Ad</button>' : ''}
                    </div>
                `;
                return;
            }
            const titles = {
                all: 'Premium Vehicles',
                car: 'Premium Cars',
                bike: 'Premium Bikes'
            };
            const sectionTitle = document.getElementById('sectionTitle');
            if (sectionTitle) {
                sectionTitle.textContent = titles[state.selectedCategory] || 'Premium Vehicles';
            }
            document.querySelectorAll('.tab').forEach(tab => {
                tab.classList.remove('active');
                if (tab.dataset.category === state.selectedCategory) {
                    tab.classList.add('active');
                }
            });
            filteredAds.forEach(ad => {
                const adCard = document.createElement('div');
                adCard.className = 'ad-card';
                adCard.innerHTML = `
                    <img src="${ad.image}" alt="${ad.title}" class="ad-image" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23262626%22 width=%22400%22 height=%22300%22/%3E%3Ctext fill=%22%23666%22 font-family=%22sans-serif%22 font-size=%2224%22 dy=%2210.5%22 font-weight=%22bold%22 x=%2250%%22 y=%2250%%22 text-anchor=%22middle%22%3E${ad.title}%3C/text%3E%3C/svg%3E'">
                    <div class="ad-content">
                        <h3 class="ad-title">${ad.title}</h3>
                        <div class="ad-price">Rs ${ad.price.toLocaleString()}</div>
                        <div class="ad-meta">
                            <span><i class="fas fa-calendar"></i> ${ad.year}</span>
                            <span><i class="fas fa-tachometer-alt"></i> ${ad.kilometers.toLocaleString()} km</span>
                        </div>
                        <p class="ad-description">${ad.description}</p>
                        <div class="ad-actions">
                            <button class="btn btn-primary" onclick="viewAdDetail(${ad.id})">
                                <i class="fas fa-eye"></i> View Details
                            </button>
                            <button class="btn btn-outline" onclick="contactSeller(${ad.id})">
                                <i class="fas fa-phone"></i> Contact
                            </button>
                            ${(state.currentUser && (String(ad.user_id) === String(state.currentUser.id) || (ad.seller && state.currentUser.username && ad.seller.toLowerCase() === state.currentUser.username.toLowerCase()))) ?
                `<div style="display:flex;gap:0.4rem;flex-wrap:wrap;margin-top:0.5rem;width:100%;">
                    <button class="btn btn-outline" style="font-size:0.78rem;padding:0.35rem 0.6rem;border-color:hsl(var(--accent));color:hsl(var(--accent));flex:1;" onclick="showEditForm(${ad.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-outline" style="font-size:0.78rem;padding:0.35rem 0.6rem;border-color:#f59e0b;color:#f59e0b;flex:1;" onclick="typeof markAdStatusDB!=='undefined'?markAdStatusDB(${ad.id},'sold'):alert('db-api.js not loaded')">
                        <i class="fas fa-handshake"></i> Sold
                    </button>
                    <button class="btn btn-outline" style="font-size:0.78rem;padding:0.35rem 0.6rem;border-color:#6b7280;color:#9ca3af;flex:1;" onclick="typeof markAdStatusDB!=='undefined'?markAdStatusDB(${ad.id},'inactive'):alert('db-api.js not loaded')">
                        <i class="fas fa-eye-slash"></i> Deactivate
                    </button>
                    <button class="btn btn-outline" style="font-size:0.78rem;padding:0.35rem 0.6rem;border-color:#ef4444;color:#ef4444;" onclick="deleteAd(${ad.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>` : ''}
                        </div>
                    </div>
                `;
                adsGrid.appendChild(adCard);
            });
        }

        async function searchVehiclesByLocation() {
            const query = document.getElementById('locationSearchInput').value.trim();
            if (!query) {
                showToast('Please enter a location.', 'error');
                return;
            }
            try {
                const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;
                const res = await fetch(url, { headers: { 'User-Agent': 'AutoTrade/1.0' } });
                const data = await res.json();
                if (data.length === 0) {
                    showToast('Location not found.', 'error');
                    return;
                }
                const { lat, lon, display_name } = data[0];
                const fullLocation = display_name;
                if (!sampleLocations[fullLocation]) {
                    sampleLocations[fullLocation] = {
                        lat: parseFloat(lat),
                        lng: parseFloat(lon)
                    };
                }
                state.userLocation = { lat: parseFloat(lat), lng: parseFloat(lon) };
                findNearbyVehicles()
            } catch (err) {
                console.error("Location search error:", err);
                showToast('Could not find location. Try again.', 'error');
            }
        }

        function viewAdDetail(adId) {
            const ad = state.ads.find(a => a.id === adId);
            if (!ad) return;
            const mainContent = document.getElementById('mainContent');
            mainContent.innerHTML = `
                <section class="ad-detail">
                    <div class="container">
                        <button class="btn btn-ghost" onclick="navigateToHome()" style="margin-bottom: 1.5rem;">
                            <i class="fas fa-arrow-left"></i> Back to Listings
                        </button>
                        <img src="${ad.image}" alt="${ad.title}" class="ad-detail-image" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22800%22 height=%22500%22%3E%3Crect fill=%22%23262626%22 width=%22800%22 height=%22500%22/%3E%3Ctext fill=%22%23666%22 font-family=%22sans-serif%22 font-size=%2236%22 dy=%2210.5%22 font-weight=%22bold%22 x=%2250%%22 y=%2250%%22 text-anchor=%22middle%22%3E${ad.title}%3C/text%3E%3C/svg%3E'">
                        <div class="ad-detail-content">
                            <div class="ad-main-info">
                                <h2>${ad.title}</h2>
                                <div class="ad-detail-price">Rs ${ad.price.toLocaleString()}</div>
                                <p style="color: hsl(var(--text-secondary)); margin-bottom: var(--spacing-lg);">${ad.description}</p>
                                <h3 style="margin-bottom: var(--spacing-md);">Vehicle Features</h3>
                                <div class="ad-features">
                                    <div class="feature-item">
                                        <i class="fas fa-calendar-alt"></i>
                                        <div>
                                            <div class="feature-label">Year</div>
                                            <div class="feature-value">${ad.year}</div>
                                        </div>
                                    </div>
                                    <div class="feature-item">
                                        <i class="fas fa-tachometer-alt"></i>
                                        <div>
                                            <div class="feature-label">Kilometers</div>
                                            <div class="feature-value">${ad.kilometers.toLocaleString()} km</div>
                                        </div>
                                    </div>
                                    <div class="feature-item">
                                        <i class="fas fa-gas-pump"></i>
                                        <div>
                                            <div class="feature-label">Fuel Type</div>
                                            <div class="feature-value">${ad.fuel}</div>
                                        </div>
                                    </div>
                                    <div class="feature-item">
                                        <i class="fas fa-map-marker-alt"></i>
                                        <div>
                                            <div class="feature-label">Location</div>
                                            <div class="feature-value">${ad.location}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="seller-card">
                                <h3 style="margin-bottom: var(--spacing-md);">Seller Information</h3>
                                <div class="seller-info">
                                    <div class="seller-avatar">${ad.seller.substring(0, 2).toUpperCase()}</div>
                                    <div class="seller-details">
                                        <h4>${ad.seller}</h4>
                                        <p>Member since ${ad.sellerSince}</p>
                                    </div>
                                </div>
                                <button class="btn btn-primary" onclick="contactSeller(${ad.id})" style="width: 100%;">
                                    <i class="fas fa-phone"></i> Contact Seller
                                </button>
                                ${(state.currentUser && (String(ad.user_id) === String(state.currentUser.id) || (ad.seller && state.currentUser.username && ad.seller.toLowerCase() === state.currentUser.username.toLowerCase()))) ?
            `<div style="display:flex;flex-direction:column;gap:0.5rem;margin-top:var(--spacing-sm);">
                <button class="btn btn-outline" onclick="showEditForm(${ad.id})" style="width:100%;border-color:hsl(var(--accent));color:hsl(var(--accent));">
                    <i class="fas fa-edit"></i> Edit Your Ad
                </button>
                <button class="btn btn-outline" onclick="typeof markAdStatusDB!=='undefined'?markAdStatusDB(${ad.id},'sold'):alert('db-api.js not loaded')" style="width:100%;border-color:#f59e0b;color:#f59e0b;">
                    <i class="fas fa-handshake"></i> Mark as Sold
                </button>
                <button class="btn btn-outline" onclick="typeof markAdStatusDB!=='undefined'?markAdStatusDB(${ad.id},'inactive'):alert('db-api.js not loaded')" style="width:100%;border-color:#6b7280;color:#9ca3af;">
                    <i class="fas fa-eye-slash"></i> Deactivate Listing
                </button>
                <button class="btn btn-outline" onclick="deleteAd(${ad.id})" style="width:100%;border-color:#ef4444;color:#ef4444;">
                    <i class="fas fa-trash"></i> Delete Ad
                </button>
            </div>` : ''}
                            </div>
                        </div>
                    </div>
                </section>
            `;
            window.scrollTo(0, 0);
        }

        function clearLocationSearch() {
            const input = document.getElementById('locationSearchInput');
            const suggestions = document.getElementById('locationSearchSuggestions');
            if (input) input.value = '';
            if (suggestions) suggestions.style.display = 'none';
            if (state.currentView !== 'nearby') {
                state.userLocation = null;
                state.currentView = 'home';
                state.selectedCategory = 'all';
                renderAds();
            }
        }

        function contactSeller(adId) {
            if (!state.currentUser) {
                showToast('Please login to contact sellers', 'error');
                setTimeout(() => showLoginForm(), 1000);
                return;
            }
            const ad = state.ads.find(a => a.id === adId);
            const phoneNumber = '+92-' + (Math.abs(ad.seller.charCodeAt(0) * 12345) % 999).toString().padStart(3, '0') + '-' + Math.random().toString().substring(2, 9);
            showToast(`${ad.seller}'s Contact: ${phoneNumber}`, 'success');
        }

        function navigateToHome() {
            state.currentView = 'home';
            state.selectedCategory = 'all';
            state.searchQuery = '';
            const searchInputElem = document.getElementById('searchInput');
            if (searchInputElem) searchInputElem.value = '';
            const mainContent = document.getElementById('mainContent');
            mainContent.innerHTML = `
        <section class="hero" id="heroSection">
            <div class="container">
                <div class="hero-content">
                    <h1>Find Your Perfect Vehicle</h1>
                    <p>Browse thousands of cars and bikes from verified sellers across Pakistan</p>
                    <div class="search-bar">
                        <input type="text" id="searchInput" placeholder="Search by brand, model, year, or seller..." onkeypress="handleSearchKeypress(event)" oninput="toggleSearchClearBtn()">
                        <button id="searchClearBtn" onclick="clearSearchInput()" style="right: 4rem; width: 36px; height: 36px; display: none;" title="Clear">
                            <i class="fas fa-times"></i>
                        </button>
                        <button onclick="performSearch()">
                            <i class="fas fa-search"></i>
                        </button>
                    </div>
                    <div class="search-bar" style="max-width: 500px; margin: var(--spacing-md) auto 3rem;">
                        <input type="text" id="locationSearchInput" placeholder="Search vehicles by location " autocomplete="off" oninput="toggleLocationClearBtn()">
                        <div id="locationSearchSuggestions" style="position: absolute; z-index: 100; width: 100%; background: hsl(var(--surface)); border: 1px solid hsl(var(--border)); border-top: none; border-radius: 0 0 var(--radius-lg) var(--radius-lg); max-height: 200px; overflow-y: auto; display: none; font-size: 0.9375rem;"></div>
                        <button id="locationClearBtn" onclick="clearLocationInput()" style="right: 4rem; width: 36px; height: 36px; display: none;" title="Clear">
                            <i class="fas fa-times"></i>
                        </button>
                        <button onclick="searchVehiclesByLocation()" style="right: 0.5rem;">
                            <i class="fas fa-location-arrow"></i>
                        </button>
                    </div>
                    <div class="hero-cta">
                        <button class="btn btn-primary" onclick="filterByCategory('car')">
                            <i class="fas fa-car"></i> Browse Cars
                        </button>
                        <button class="btn btn-outline" onclick="showPublishFormOrLogin()">
                            <i class="fas fa-plus-circle"></i> Sell Your Vehicle
                        </button>
                    </div>
                </div>
            </div>
        </section>
        <section class="category-tabs" id="categoryTabs">
            <div class="container">
                <div class="tabs">
                    <button class="tab active" data-category="all" onclick="filterByCategory('all')">
                        All Vehicles
                    </button>
                    <button class="tab" data-category="car" onclick="filterByCategory('car')">
                        <i class="fas fa-car"></i> Cars
                    </button>
                    <button class="tab" data-category="bike" onclick="filterByCategory('bike')">
                        <i class="fas fa-motorcycle"></i> Bikes
                    </button>
                    <button class="tab" data-category="nearby" onclick="showNearbyVehicles()">
                        <i class="fas fa-location-arrow"></i> Nearby Vehicles
                    </button>
                </div>
            </div>
        </section>
        <section class="ads-section" id="adsSection">
            <div class="container">
                <div class="section-header">
                    <h2 id="sectionTitle">Premium Vehicles</h2>
                </div>
                <div class="ads-grid" id="adsGrid"></div>
            </div>
        </section>
    `;
            renderAds();
            updateActiveNavLink();
            setTimeout(() => {
                const input = document.getElementById('locationSearchInput');
                if (input) {
                    input.addEventListener('input', (e) => debouncedLocationSearch(e.target.value));
                    document.addEventListener('click', (e) => {
                        const dropdown = document.getElementById('locationSearchSuggestions');
                        if (dropdown && !input.contains(e.target) && !dropdown.contains(e.target)) {
                            dropdown.style.display = 'none';
                        }
                    }, { once: true });
                }
            }, 100);
        }

        function filterByCategory(category) {
            if (category === 'nearby') {
                showNearbyVehicles();
                return;
            }
            state.selectedCategory = category;
            state.currentView = 'home';
            state.searchQuery = '';
            state.userLocation = null;
            document.querySelectorAll('.tab').forEach(tab => {
                tab.classList.remove('active');
                if (tab.dataset.category === category) {
                    tab.classList.add('active');
                }
            });
            const titles = {
                all: 'Premium Vehicles',
                car: 'Premium Cars',
                bike: 'Premium Bikes'
            };
            const sectionTitle = document.getElementById('sectionTitle');
            if (sectionTitle) {
                sectionTitle.textContent = titles[category];
            }
            renderAds();
            updateActiveNavLink();
        }

        function showMyPosts() {
            if (!state.currentUser) {
                showToast('Please login to view your posts', 'error');
                return;
            }
            state.currentView = 'myPosts';
            state.selectedCategory = 'all';
            const mainContent = document.getElementById('mainContent');
            mainContent.innerHTML = `
                <section class="ads-section" style="padding-top: var(--spacing-xl);">
                    <div class="container">
                        <div class="section-header">
                            <h2>My Active Ads</h2>
                            <p>Manage your listings — edit, mark sold, deactivate or delete</p>
                            <div style="display:flex;gap:0.75rem;flex-wrap:wrap;margin-top:var(--spacing-md);">
                                <button class="btn btn-outline" onclick="navigateToHome()">
                                    <i class="fas fa-arrow-left"></i> Back to Home
                                </button>
                                <button class="btn btn-outline" onclick="typeof showInactiveAds!=='undefined'?showInactiveAds():showToast('Load db-api.js','error')" style="border-color:#f59e0b;color:#f59e0b;">
                                    <i class="fas fa-archive"></i> Inactive Ads
                                </button>
                            </div>
                        </div>
                        <div class="ads-grid" id="adsGrid"></div>
                    </div>
                </section>
            `;
            renderAds();
            updateActiveNavLink();
        }

        function updateActiveNavLink() {
            const links = document.querySelectorAll('.nav-links a');
            links.forEach(link => link.classList.remove('active'));
            if (state.currentView === 'home') {
                if (state.selectedCategory && state.selectedCategory !== 'all') {
                    const categoryLink = document.querySelector(`.nav-links a[onclick="filterByCategory('${state.selectedCategory}')"]`);
                    if (categoryLink) {
                        categoryLink.classList.add('active');
                        return;
                    }
                }
                const homeLink = document.querySelector('.nav-links a[onclick="navigateToHome()"]');
                if (homeLink) homeLink.classList.add('active');
                return;
            }
            if (state.currentView === 'myPosts') {
                const myPostsLink = document.getElementById('myPostsLink');
                if (myPostsLink) myPostsLink.classList.add('active');
            }
        }

        function performSearch() {
            const searchInput = document.getElementById('searchInput');
            state.searchQuery = searchInput.value.trim();
            renderAds();
        }

        function handleSearchKeypress(event) {
            if (event.key === 'Enter') {
                performSearch();
            }
        }

        function showLoginForm() {
            const mainContent = document.getElementById('mainContent');
            mainContent.innerHTML = `
                <div class="form-container" style="max-width:480px;margin:3rem auto;">
                    <div style="text-align:center;margin-bottom:var(--spacing-xl);">
                        <div style="width:64px;height:64px;border-radius:50%;background:var(--gradient-primary);display:inline-flex;align-items:center;justify-content:center;margin-bottom:var(--spacing-md);">
                            <i class="fas fa-user" style="font-size:1.5rem;color:#fff;"></i>
                        </div>
                        <h2 style="margin-bottom:0.5rem;">Welcome Back</h2>
                        <p style="color:hsl(var(--text-secondary));">Sign in to your AutoTrade account</p>
                    </div>
                    <form onsubmit="handleLogin(event)">
                        <div class="form-group">
                            <label for="loginUsername"><i class="fas fa-envelope" style="margin-right:6px;opacity:0.7;"></i>Email Address</label>
                            <input type="email" id="loginUsername" placeholder="Enter your email" required autocomplete="email">
                        </div>
                        <div class="form-group">
                            <label for="loginPassword"><i class="fas fa-lock" style="margin-right:6px;opacity:0.7;"></i>Password</label>
                            <input type="password" id="loginPassword" placeholder="Enter your password" required autocomplete="current-password">
                        </div>
                        <button type="submit" class="btn btn-primary" style="width:100%;margin-top:var(--spacing-md);padding:0.85rem;font-size:1rem;">
                            <i class="fas fa-sign-in-alt"></i> Sign In
                        </button>
                        <button type="button" class="btn btn-ghost" onclick="navigateToHome()" style="width:100%;margin-top:var(--spacing-sm);">
                            Cancel
                        </button>
                    </form>
                    <p style="text-align:center;margin-top:var(--spacing-lg);color:hsl(var(--text-muted));font-size:0.9rem;">
                        Don&apos;t have an account? <a onclick="showRegisterForm()" style="color:hsl(var(--primary));cursor:pointer;font-weight:600;">Register here</a>
                    </p>
                </div>
            `;
        }

        function showRegisterForm() {
            const mainContent = document.getElementById('mainContent');
            mainContent.innerHTML = `
                <div class="form-container" style="max-width:480px;margin:3rem auto;">
                    <div style="text-align:center;margin-bottom:var(--spacing-xl);">
                        <div style="width:64px;height:64px;border-radius:50%;background:var(--gradient-primary);display:inline-flex;align-items:center;justify-content:center;margin-bottom:var(--spacing-md);">
                            <i class="fas fa-user-plus" style="font-size:1.5rem;color:#fff;"></i>
                        </div>
                        <h2 style="margin-bottom:0.5rem;">Create Account</h2>
                        <p style="color:hsl(var(--text-secondary));">Join AutoTrade and start selling today</p>
                    </div>
                    <form onsubmit="handleRegister(event)">
                        <div class="form-group">
                            <label for="regName"><i class="fas fa-user" style="margin-right:6px;opacity:0.7;"></i>Full Name</label>
                            <input type="text" id="regName" placeholder="Enter your full name" required>
                        </div>
                        <div class="form-group">
                            <label for="regEmail"><i class="fas fa-envelope" style="margin-right:6px;opacity:0.7;"></i>Email Address</label>
                            <input type="email" id="regEmail" placeholder="Enter your email" required>
                        </div>
                        <div class="form-group">
                            <label for="regPhone"><i class="fas fa-phone" style="margin-right:6px;opacity:0.7;"></i>Phone Number</label>
                            <input type="text" id="regPhone" placeholder="e.g. 03001234567" required>
                        </div>
                        <div class="form-group">
                            <label for="regPassword"><i class="fas fa-lock" style="margin-right:6px;opacity:0.7;"></i>Password</label>
                            <input type="password" id="regPassword" placeholder="Create a password (min 6 chars)" required minlength="6">
                        </div>
                        <button type="submit" class="btn btn-primary" style="width:100%;margin-top:var(--spacing-md);padding:0.85rem;font-size:1rem;">
                            <i class="fas fa-user-plus"></i> Create Account
                        </button>
                        <button type="button" class="btn btn-ghost" onclick="showLoginForm()" style="width:100%;margin-top:var(--spacing-sm);">
                            Already have an account? Sign In
                        </button>
                    </form>
                </div>
            `;
        }

        function handleLogin(event) {
            event.preventDefault(); // overridden by db-api.js
        }

        function handleRegister(event) {
            event.preventDefault(); // overridden by db-api.js
        }

                function logout() {
            state.currentUser = null;
            updateAuthUI();
            showToast('Logged out successfully', 'success');
            navigateToHome();
        }

        function updateAuthUI() {
            const loginBtn = document.getElementById('loginBtn');
            const publishBtn = document.getElementById('publishBtn');
            const userProfile = document.getElementById('userProfile');
            const userAvatar = document.getElementById('userAvatar');
            const username = document.getElementById('username');
            const myPostsLink = document.getElementById('myPostsLink');
            if (state.currentUser) {
                loginBtn.classList.add('hidden');
                publishBtn.classList.remove('hidden');
                userProfile.classList.remove('hidden');
                myPostsLink.classList.remove('hidden');
                const inactiveLink = document.getElementById('inactiveAdsLink');
                if (inactiveLink) inactiveLink.classList.remove('hidden');
                userAvatar.textContent = state.currentUser.avatar;
                username.textContent = state.currentUser.username;
            } else {
                loginBtn.classList.remove('hidden');
                publishBtn.classList.add('hidden');
                userProfile.classList.add('hidden');
                myPostsLink.classList.add('hidden');
                const inactiveLink2 = document.getElementById('inactiveAdsLink');
                if (inactiveLink2) inactiveLink2.classList.add('hidden');
            }
        }

        function showPublishFormOrLogin() {
            if (!state.currentUser) {
                showToast('Please login to publish an ad', 'error');
                setTimeout(() => showLoginForm(), 1000);
                return;
            }
            showPublishForm();
        }

        function showPublishForm() {
            if (!state.currentUser) {
                showToast('Please login to publish an ad', 'error');
                return;
            }
            const mainContent = document.getElementById('mainContent');
            mainContent.innerHTML = `
                <div class="form-container">
                    <h2 style="text-align: center; margin-bottom: var(--spacing-md);">Publish Your Vehicle</h2>
                    <p style="text-align: center; color: hsl(var(--text-secondary)); margin-bottom: var(--spacing-xl);">
                        List your car or bike and reach thousands of potential buyers
                    </p>
                    <form onsubmit="handlePublishAd(event)">
                        <div class="form-group">
                            <label for="adTitle">Title *</label>
                            <input type="text" id="adTitle" placeholder="e.g., BMW M4 Competition 2023" required>
                        </div>
                        <div class="form-group">
                            <label for="adCategory">Category *</label>
                            <select id="adCategory" required>
                                <option value="">Select category</option>
                                <option value="car">Car</option>
                                <option value="bike">Bike</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="adPrice">Price (PKR) *</label>
                            <input type="number" id="adPrice" placeholder="e.g., 5000000" required>
                        </div>
                        <div class="form-group">
                            <label for="adYear">Year *</label>
                            <input type="number" id="adYear" placeholder="e.g., 2023" min="1990" max="2024" required>
                        </div>
                        <div class="form-group">
                            <label for="adKilometers">Kilometers *</label>
                            <input type="number" id="adKilometers" placeholder="e.g., 5000" required>
                        </div>
                        <div class="form-group">
                            <label for="adFuel">Fuel Type *</label>
                            <select id="adFuel" required>
                                <option value="">Select fuel type</option>
                                <option value="Petrol">Petrol</option>
                                <option value="Diesel">Diesel</option>
                                <option value="Electric">Electric</option>
                                <option value="Hybrid">Hybrid</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="adDescription">Description *</label>
                            <textarea id="adDescription" placeholder="Describe your vehicle in detail..." required></textarea>
                        </div>
                        <div class="form-group">
                            <label>Vehicle Image</label>
                            <div class="image-upload">
                                <input type="file" id="adImage" accept="image/*" onchange="previewImage(event)">
                                <label for="adImage" class="upload-label">
                                    <i class="fas fa-cloud-upload-alt"></i>
                                    <p>Click to upload image</p>
                                    <small style="color: hsl(var(--text-muted));">JPG, PNG or WebP (Max 5MB)</small>
                                </label>
                                <div class="image-preview" id="imagePreview">
                                    <img id="previewImg" src="" alt="Preview">
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Location</label>
                            <div class="location-prompt">
                                <p style="margin-bottom: var(--spacing-sm); color: hsl(var(--text-secondary));">
                                    Would you like to share your location automatically?
                                </p>
                                <div class="location-buttons">
                                    <button type="button" class="btn btn-primary" onclick="getAutoLocation()">
                                        <i class="fas fa-location-arrow"></i> Use My Location
                                    </button>
                                    <button type="button" class="btn btn-outline" onclick="showManualLocation()">
                                        <i class="fas fa-map-marker-alt"></i> Enter Manually
                                    </button>
                                </div>
                            </div>
                            <div class="location-input-container" style="display: none; margin-top: var(--spacing-md);">
    <input type="text" id="adLocation" placeholder="e.g., Lahore, Pakistan" required autocomplete="off">
    <div id="locationSuggestions"></div>
</div>
                        </div>
                        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: var(--spacing-lg);">
                            <i class="fas fa-check"></i> Publish Ad
                        </button>
                        <button type="button" class="btn btn-ghost" onclick="navigateToHome()" style="width: 100%; margin-top: var(--spacing-sm);">
                            Cancel
                        </button>
                    </form>
                </div>
            `;
            setTimeout(() => {
                initLocationAutocomplete();
            }, 100);
        }


        function showEditForm(adId) {
            if (!state.currentUser) { showToast('Please login to edit an ad', 'error'); return; }
            const ad = state.ads.find(a => a.id === adId)
                    || (state._inactiveAds && state._inactiveAds.find(a => a.id === adId));
            if (!ad) { showToast('Ad not found.', 'error'); return; }

            const mainContent = document.getElementById('mainContent');
            mainContent.innerHTML = `
                <div class="form-container">
                    <h2 style="text-align:center;margin-bottom:var(--spacing-md);">
                        <i class="fas fa-edit" style="color:hsl(var(--accent));margin-right:0.5rem;"></i>Edit Your Ad
                    </h2>
                    <p style="text-align:center;color:hsl(var(--text-secondary));margin-bottom:var(--spacing-xl);">
                        Update the details for <strong>${ad.title}</strong>
                    </p>
                    <form onsubmit="typeof handleEditAdDB!=='undefined'?handleEditAdDB(event,${adId}):handleEditAdLocal(event,${adId})">
                        <div class="form-group">
                            <label for="adTitle">Title *</label>
                            <input type="text" id="adTitle" value="${ad.title.replace(/"/g,'&quot;')}" required>
                        </div>
                        <div class="form-group">
                            <label for="adCategory">Category *</label>
                            <select id="adCategory" required>
                                <option value="">Select category</option>
                                <option value="car" ${ad.category==='car'?'selected':''}>Car</option>
                                <option value="bike" ${ad.category==='bike'?'selected':''}>Bike</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="adPrice">Price (PKR) *</label>
                            <input type="number" id="adPrice" value="${ad.price}" required>
                        </div>
                        <div class="form-group">
                            <label for="adYear">Year *</label>
                            <input type="number" id="adYear" value="${ad.year}" min="1990" max="2030" required>
                        </div>
                        <div class="form-group">
                            <label for="adKilometers">Kilometers *</label>
                            <input type="number" id="adKilometers" value="${ad.kilometers}" required>
                        </div>
                        <div class="form-group">
                            <label for="adFuel">Fuel Type *</label>
                            <select id="adFuel" required>
                                <option value="">Select fuel type</option>
                                <option value="Petrol"   ${ad.fuel==='Petrol'   ?'selected':''}>Petrol</option>
                                <option value="Diesel"   ${ad.fuel==='Diesel'   ?'selected':''}>Diesel</option>
                                <option value="Electric" ${ad.fuel==='Electric' ?'selected':''}>Electric</option>
                                <option value="Hybrid"   ${ad.fuel==='Hybrid'   ?'selected':''}>Hybrid</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="adDescription">Description *</label>
                            <textarea id="adDescription" required>${ad.description}</textarea>
                        </div>
                        <div class="form-group">
                            <label>New Image <span style="color:hsl(var(--text-muted));font-size:0.85rem;">(leave blank to keep current)</span></label>
                            <div class="image-upload">
                                <input type="file" id="adImage" accept="image/*" onchange="previewImage(event)">
                                <label for="adImage" class="upload-label">
                                    <i class="fas fa-cloud-upload-alt"></i>
                                    <p>Click to upload new image</p>
                                    <small style="color:hsl(var(--text-muted));">JPG, PNG or WebP (Max 5MB)</small>
                                </label>
                                <div class="image-preview" id="imagePreview" style="display:block;">
                                    <img id="previewImg" src="${ad.image}" alt="Current image" style="max-height:200px;border-radius:8px;">
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="adLocation">Location *</label>
                            <div class="location-input-container" style="display:block;">
                                <input type="text" id="adLocation" value="${ad.location}" required autocomplete="off">
                                <div id="locationSuggestions"></div>
                            </div>
                        </div>
                        <button type="submit" class="btn btn-primary" style="width:100%;margin-top:var(--spacing-lg);">
                            <i class="fas fa-save"></i> Save Changes
                        </button>
                        <button type="button" class="btn btn-ghost" onclick="navigateToHome()" style="width:100%;margin-top:var(--spacing-sm);">
                            Cancel
                        </button>
                    </form>
                </div>
            `;
            setTimeout(() => { if(typeof initLocationAutocomplete==='function') initLocationAutocomplete(); }, 100);
        }

        // Fallback edit handler (no DB — updates demo state only)
        function handleEditAdLocal(event, adId) {
            event.preventDefault();
            const ad = state.ads.find(a => a.id === adId);
            if (!ad) return;
            ad.title       = document.getElementById('adTitle').value.trim();
            ad.category    = document.getElementById('adCategory').value;
            ad.price       = parseInt(document.getElementById('adPrice').value);
            ad.year        = parseInt(document.getElementById('adYear').value);
            ad.kilometers  = parseInt(document.getElementById('adKilometers').value);
            ad.fuel        = document.getElementById('adFuel').value;
            ad.description = document.getElementById('adDescription').value.trim();
            ad.location    = document.getElementById('adLocation').value.trim();
            const imgEl    = document.getElementById('previewImg');
            if (imgEl && imgEl.src && !imgEl.src.startsWith('data:image/svg')) ad.image = imgEl.src;
            showToast('Ad updated!', 'success');
            showMyPosts();
        }

        function deleteAd(adId) {
            if (!state.currentUser) {
                showToast('You must be logged in to delete an ad.', 'error');
                return;
            }
            const adIndex = state.ads.findIndex(ad => ad.id === adId);
            if (adIndex === -1) {
                showToast('Ad not found.', 'error');
                return;
            }
            const ad = state.ads[adIndex];
            if (ad.seller !== state.currentUser.username) {
                showToast('You can only delete your own ads.', 'error');
                return;
            }
            if (!confirm(`Are you sure you want to delete your ad: "${ad.title}"?`)) {
                return;
            }
            state.ads.splice(adIndex, 1);
            showToast('Ad deleted successfully!', 'success');
            if (state.currentView === 'myPosts') {
                showMyPosts();
            } else if (state.currentView === 'nearby') {
                findNearbyVehicles();
            } else {
                renderAds();
            }
        }

        function previewImage(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    const preview = document.getElementById('imagePreview');
                    const previewImg = document.getElementById('previewImg');
                    previewImg.src = e.target.result;
                    preview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        }

        async function getAutoLocation() {
            if (!navigator.geolocation) {
                showToast('Geolocation not supported. Please enter manually.', 'error');
                showManualLocation();
                return;
            }
            try {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
                });
                const { latitude, longitude } = position.coords;
                showToast('Detecting your location...', 'success');
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1&accept-language=en`
                );
                const data = await response.json();
                const address = data.display_name || "Unknown Location";
                document.getElementById('adLocation').value = address;
                document.querySelector('.location-input-container').style.display = 'block';
                showToast(`Location set: ${address.split(',')[0]}`, 'success');
            } catch (err) {
                console.error("Geolocation error:", err);
                showToast('Could not detect location. Please enter manually.', 'error');
                showManualLocation();
            }
        }

        function showManualLocation() {
            const container = document.querySelector('.location-input-container');
            if (container) {
                container.style.display = 'block';
                document.getElementById('adLocation').focus();
            }
        }

        async function handlePublishAd(event) {
            event.preventDefault();
            const title = document.getElementById('adTitle').value;
            const category = document.getElementById('adCategory').value;
            const price = parseInt(document.getElementById('adPrice').value);
            const year = parseInt(document.getElementById('adYear').value);
            const kilometers = parseInt(document.getElementById('adKilometers').value);
            const fuel = document.getElementById('adFuel').value;
            const description = document.getElementById('adDescription').value;
            const location = document.getElementById('adLocation').value.trim();
            const imageFile = document.getElementById('adImage').files[0];
            if (!location) {
                showToast('Please enter a valid location.', 'error');
                return;
            }
            let coordinates = null;
            try {
                const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`;
                const response = await fetch(url, {
                    headers: { 'User-Agent': 'AutoTrade/1.0' }
                });
                const data = await response.json();
                if (data.length > 0) {
                    coordinates = {
                        lat: parseFloat(data[0].lat),
                        lng: parseFloat(data[0].lon)
                    };
                    sampleLocations[location] = coordinates;
                } else {
                    showToast('Could not verify location. Using default.', 'warning');
                    coordinates = { lat: 33.7240, lng: 73.0854 };
                    sampleLocations[location] = coordinates;
                }
            } catch (err) {
                console.warn("Geocoding failed:", err);
                showToast('Location lookup failed. Using default coordinates.', 'warning');
                coordinates = { lat: 33.7240, lng: 73.0854 };
                sampleLocations[location] = coordinates;
            }
            const newAd = {
                id: state.ads.length + 1,
                title,
                category,
                price,
                year,
                kilometers,
                fuel,
                description,
                location,
                image: imageFile ? URL.createObjectURL(imageFile) : `data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23262626%22 width=%22400%22 height=%22300%22/%3E%3Ctext fill=%22%23666%22 font-family=%22sans-serif%22 font-size=%2224%22 dy=%2210.5%22 font-weight=%22bold%22 x=%2250%%22 y=%2250%%22 text-anchor=%22middle%22%3E${encodeURIComponent(title)}%3C/text%3E%3C/svg%3E`,
                seller: state.currentUser.username,
                sellerSince: new Date().getFullYear().toString()
            };
            state.ads.unshift(newAd);
            showToast('Your ad has been published successfully!', 'success');
            navigateToHome();
        }

        function showToast(message, type = 'success') {
            const toastContainer = document.getElementById('toastContainer');
            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
            toast.innerHTML = `
                <i class="fas ${icon}"></i>
                <div class="toast-message">${message}</div>
                <button class="toast-close" onclick="this.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            `;
            toastContainer.appendChild(toast);
            setTimeout(() => {
                toast.remove();
            }, 4000);
        }

        // init is called by db-api.js below
