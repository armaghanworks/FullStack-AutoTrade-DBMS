// ============================================================
// AutoTrade - db-api.js
// Connects Oracle DB to frontend via server.js
// ============================================================

const API_BASE = 'http://localhost:3000/api';

// ── API caller ─────────────────────────────────────────────
async function apiCall(endpoint, method = 'GET', body = null) {
    const opts = { method, headers: { 'Content-Type': 'application/json' } };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(API_BASE + endpoint, opts);
    const ct = res.headers.get('content-type') || '';
    if (!ct.includes('application/json')) {
        throw new Error('Server error (HTTP ' + res.status + '). Is node server.js running?');
    }
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Server error');
    return data;
}

// ── Session: save/restore across page refresh ──────────────
function saveSession(user) {
    try { localStorage.setItem('at_user', JSON.stringify(user)); } catch(e) {}
}
function clearSession() {
    try { localStorage.removeItem('at_user'); } catch(e) {}
}
function restoreSession() {
    try {
        const raw = localStorage.getItem('at_user');
        if (!raw) return;
        const user = JSON.parse(raw);
        if (user && user.id) {
            state.currentUser = user;
            // Try updateAuthUI — retry after DOM ready if elements not found yet
            try {
                updateAuthUI();
            } catch(e) {
                setTimeout(() => { try { updateAuthUI(); } catch(e2) {} }, 100);
            }
        }
    } catch(e) { clearSession(); }
}

// ── Map Oracle row → script.js ad format ──────────────────
function mapRow(row) {
    // image_url column only (no image_data — column may not exist yet)
    const img = (row.IMAGE_URL && row.IMAGE_URL.trim() !== '')
        ? row.IMAGE_URL
        : 'https://placehold.co/400x250/1e293b/94a3b8?text=' + encodeURIComponent(row.TITLE || 'Vehicle');
    return {
        id         : row.VEHICLE_ID,
        user_id    : row.USER_ID,
        title      : row.TITLE       || '',
        category   : (row.CATEGORY_NAME || 'car').toLowerCase(),
        price      : row.PRICE       || 0,
        year       : row.YEAR        || 2024,
        kilometers : row.KILOMETERS  || 0,
        fuel       : row.FUEL        || 'Petrol',
        description: row.DESCRIPTION || '',
        image      : img,
        seller     : row.SELLER      || 'Unknown',
        sellerPhone: row.SELLER_PHONE || '',
        sellerSince: '2024',
        location   : row.LOCATION    || 'Pakistan',
        latitude   : row.LATITUDE    || 33.7240,
        longitude  : row.LONGITUDE   || 73.0854,
        status     : row.LISTING_STATUS || 'active',
        postDate   : row.POST_DATE
    };
}

// ── Load vehicles from Oracle ──────────────────────────────
async function loadVehiclesFromDB() {
    try {
        const data = await apiCall('/vehicles');
        state.ads = data.data.map(mapRow);
        state.ads.forEach(ad => {
            if (ad.location && ad.latitude && ad.longitude) {
                sampleLocations[ad.location] = { lat: ad.latitude, lng: ad.longitude };
            }
        });
        renderAds();
    } catch (err) {
        console.warn('DB unavailable, using demo data:', err.message);
        state.ads = [...demoAds];
        renderAds();
    }
}

// ── LOGIN ──────────────────────────────────────────────────
async function handleLoginDB(event) {
    event.preventDefault();
    const email    = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    if (!email || !password) { showToast('Please enter email and password.', 'error'); return; }

    const btn = event.target.querySelector('button[type="submit"]');
    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...'; }

    try {
        const data = await apiCall('/login', 'POST', { email, password });
        const u = data.user;
        const user = { id: u.USER_ID, username: u.NAME, email: u.EMAIL, avatar: u.NAME.substring(0,2).toUpperCase() };
        state.currentUser = user;
        saveSession(user);
        updateAuthUI();
        showToast('Welcome back, ' + u.NAME + '!', 'success');
        navigateToHome();
    } catch (err) {
        showToast(err.message || 'Login failed.', 'error');
        if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In'; }
    }
}

// ── LOGOUT ─────────────────────────────────────────────────
function logoutDB() {
    state.currentUser = null;
    clearSession();
    updateAuthUI();
    showToast('Logged out successfully.', 'success');
    navigateToHome();
}

// ── REGISTER ───────────────────────────────────────────────
async function handleRegisterDB(event) {
    event.preventDefault();
    const name     = document.getElementById('regName').value.trim();
    const email    = document.getElementById('regEmail').value.trim();
    const phone    = document.getElementById('regPhone').value.trim();
    const password = document.getElementById('regPassword').value.trim();

    const btn = event.target.querySelector('button[type="submit"]');
    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating...'; }

    try {
        await apiCall('/register', 'POST', { name, email, phone, password });
        showToast('Account created! Please sign in.', 'success');
        showLoginForm();
    } catch (err) {
        showToast(err.message || 'Registration failed.', 'error');
        if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-user-plus"></i> Create Account'; }
    }
}

// ── Resize image before upload (avoids 413 error) ─────────
function resizeImageToBase64(file, maxW, maxH, quality) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                let w = img.width, h = img.height;
                if (w > maxW) { h = Math.round(h * maxW / w); w = maxW; }
                if (h > maxH) { w = Math.round(w * maxH / h); h = maxH; }
                const canvas = document.createElement('canvas');
                canvas.width = w; canvas.height = h;
                canvas.getContext('2d').drawImage(img, 0, 0, w, h);
                resolve(canvas.toDataURL('image/jpeg', quality));
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
}

// ── PUBLISH VEHICLE ────────────────────────────────────────
async function handlePublishAdDB(event) {
    event.preventDefault();
    if (!state.currentUser) { showToast('Please login first.', 'error'); return; }

    const submitBtn = event.target.querySelector('button[type="submit"]');
    if (submitBtn) { submitBtn.disabled = true; submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Publishing...'; }

    function resetBtn() {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = '<i class="fas fa-check"></i> Publish Ad'; }
    }

    try {
        const title       = document.getElementById('adTitle').value.trim();
        const categoryVal = document.getElementById('adCategory').value;
        const price       = parseInt(document.getElementById('adPrice').value);
        const year        = parseInt(document.getElementById('adYear').value) || 2024;
        const kilometers  = parseInt(document.getElementById('adKilometers').value) || 0;
        const fuel        = document.getElementById('adFuel').value || 'Petrol';
        const description = document.getElementById('adDescription').value.trim();
        const locEl       = document.getElementById('adLocation');
        const location    = locEl ? locEl.value.trim() : '';

        if (!title)        { showToast('Please enter a title.',    'error'); resetBtn(); return; }
        if (!categoryVal)  { showToast('Please select category.',  'error'); resetBtn(); return; }
        if (!price || price <= 0) { showToast('Please enter a valid price.', 'error'); resetBtn(); return; }
        if (!location)     { showToast('Please enter a location.', 'error'); resetBtn(); return; }

        // Resize and encode image (max 600x400, quality 0.6 = small file)
        const imageInput = document.getElementById('adImage');
        const imageFile  = imageInput && imageInput.files[0] ? imageInput.files[0] : null;
        let image_url = '';
        if (imageFile) {
            image_url = await resizeImageToBase64(imageFile, 600, 400, 0.6);
        }

        const category_id = categoryVal === 'car' ? 1 : 2;

        // Find or create location
        let location_id = 1;
        try {
            const locData = await apiCall('/locations');
            const key = location.toLowerCase().split(',')[0].trim();
            const match = locData.data.find(l => l.CITY && l.CITY.toLowerCase().includes(key));
            if (match) {
                location_id = match.LOCATION_ID;
            } else {
                const newLoc = await apiCall('/locations', 'POST', { city: location, latitude: 33.7240, longitude: 73.0854 });
                if (newLoc && newLoc.location_id) location_id = newLoc.location_id;
            }
        } catch(e) { /* use default */ }

        const payload = {
            title,
            brand      : title.split(' ')[0],
            model      : title.split(' ').slice(1).join(' ') || title,
            price, year, kilometers, fuel, description,
            image_url,          // stored in image_url column (VARCHAR2 fits resized base64)
            category_id,
            location_id,
            user_id: state.currentUser.id
        };

        await apiCall('/vehicles', 'POST', payload);

        // Reload DB data silently first (without rendering — no adsGrid on success screen)
        try {
            const freshData = await apiCall('/vehicles');
            state.ads = freshData.data.map(mapRow);
            state.ads.forEach(ad => {
                if (ad.location && ad.latitude && ad.longitude) {
                    sampleLocations[ad.location] = { lat: ad.latitude, lng: ad.longitude };
                }
            });
        } catch(e) { /* keep old ads if reload fails */ }

        // ✅ Now show success screen (data is already refreshed in state.ads)
        const mainContent = document.getElementById('mainContent');
        mainContent.innerHTML = `
            <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;
                        min-height:60vh;text-align:center;padding:2rem;">
                <div style="width:80px;height:80px;border-radius:50%;
                            background:linear-gradient(135deg,#10b981,#059669);
                            display:flex;align-items:center;justify-content:center;
                            margin-bottom:1.5rem;box-shadow:0 0 30px rgba(16,185,129,0.4);">
                    <i class="fas fa-check" style="font-size:2.5rem;color:#fff;"></i>
                </div>
                <h2 style="font-size:2rem;margin-bottom:0.75rem;">Ad Published!</h2>
                <p style="color:hsl(var(--text-secondary));font-size:1.1rem;max-width:420px;margin-bottom:2rem;">
                    Your vehicle <strong>${title}</strong> is now live for buyers across Pakistan.
                </p>
                <div style="display:flex;gap:1rem;flex-wrap:wrap;justify-content:center;">
                    <button class="btn btn-primary" onclick="navigateToHome()" style="padding:0.85rem 2rem;">
                        <i class="fas fa-home"></i> Go to Home
                    </button>
                    <button class="btn btn-outline" onclick="showMyPosts()" style="padding:0.85rem 2rem;">
                        <i class="fas fa-list"></i> My Posts
                    </button>
                </div>
            </div>`;

    } catch (err) {
        showToast(err.message || 'Failed to publish. Check server terminal.', 'error');
        resetBtn();
    }
}

// ── DELETE VEHICLE ─────────────────────────────────────────
async function deleteAdDB(adId) {
    if (!state.currentUser) { showToast('Please login first.', 'error'); return; }
    const ad = state.ads.find(a => a.id === adId);
    if (!ad) { showToast('Ad not found.', 'error'); return; }
    if (!confirm('Delete "' + ad.title + '"?')) return;
    try {
        await apiCall('/vehicles/' + adId, 'DELETE');
        showToast('Ad deleted!', 'success');
        await loadVehiclesFromDB();
        if (state.currentView === 'myPosts') showMyPosts();
        else renderAds();
    } catch (err) {
        showToast(err.message || 'Delete failed.', 'error');
    }
}


// ── EDIT VEHICLE ───────────────────────────────────────────
async function handleEditAdDB(event, adId) {
    event.preventDefault();
    if (!state.currentUser) { showToast('Please login first.', 'error'); return; }

    const submitBtn = event.target.querySelector('button[type="submit"]');
    if (submitBtn) { submitBtn.disabled = true; submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...'; }

    function resetBtn() {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = '<i class="fas fa-save"></i> Save Changes'; }
    }

    try {
        const title       = document.getElementById('adTitle').value.trim();
        const categoryVal = document.getElementById('adCategory').value;
        const price       = parseInt(document.getElementById('adPrice').value);
        const year        = parseInt(document.getElementById('adYear').value) || 2024;
        const kilometers  = parseInt(document.getElementById('adKilometers').value) || 0;
        const fuel        = document.getElementById('adFuel').value || 'Petrol';
        const description = document.getElementById('adDescription').value.trim();
        const locEl       = document.getElementById('adLocation');
        const location    = locEl ? locEl.value.trim() : '';

        if (!title)       { showToast('Please enter a title.',    'error'); resetBtn(); return; }
        if (!categoryVal) { showToast('Please select category.',  'error'); resetBtn(); return; }
        if (!price || price <= 0) { showToast('Please enter a valid price.', 'error'); resetBtn(); return; }
        if (!location)    { showToast('Please enter a location.', 'error'); resetBtn(); return; }

        // Only re-encode image if a new file was chosen
        const imageInput = document.getElementById('adImage');
        const imageFile  = imageInput && imageInput.files[0] ? imageInput.files[0] : null;
        let image_url = null;   // null = keep existing image
        if (imageFile) {
            image_url = await resizeImageToBase64(imageFile, 600, 400, 0.6);
        }

        const category_id = categoryVal === 'car' ? 1 : 2;

        // Find or create location
        let location_id = 1;
        try {
            const locData = await apiCall('/locations');
            const key = location.toLowerCase().split(',')[0].trim();
            const match = locData.data.find(l => l.CITY && l.CITY.toLowerCase().includes(key));
            if (match) {
                location_id = match.LOCATION_ID;
            } else {
                const newLoc = await apiCall('/locations', 'POST', { city: location, latitude: 33.7240, longitude: 73.0854 });
                if (newLoc && newLoc.location_id) location_id = newLoc.location_id;
            }
        } catch(e) { /* use default */ }

        const payload = {
            title, price, year, kilometers, fuel, description,
            category_id, location_id,
            user_id: state.currentUser.id,
            ...(image_url !== null ? { image_url } : {})
        };

        await apiCall('/vehicles/' + adId, 'PUT', payload);

        // Refresh ads
        try {
            const freshData = await apiCall('/vehicles');
            state.ads = freshData.data.map(mapRow);
        } catch(e) {}

        showToast('Ad updated successfully!', 'success');
        showMyPosts();

    } catch (err) {
        showToast(err.message || 'Update failed. Check server terminal.', 'error');
        resetBtn();
    }
}

// ── MARK AD STATUS (sold / inactive / active) ──────────────
async function markAdStatusDB(adId, newStatus) {
    if (!state.currentUser) { showToast('Please login first.', 'error'); return; }

    const ad = state.ads.find(a => a.id === adId)
            || (state._inactiveAds && state._inactiveAds.find(a => a.id === adId));
    if (!ad) { showToast('Ad not found.', 'error'); return; }

    const labels = { sold: 'Mark as Sold', inactive: 'Deactivate', active: 'Re-publish' };
    const confirmMsg = {
        sold    : `Mark "${ad.title}" as SOLD?\nIt will move to your Inactive Ads.`,
        inactive: `Deactivate "${ad.title}"?\nIt will be hidden from buyers. You can re-publish later.`,
        active  : `Re-publish "${ad.title}"?\nIt will appear live for buyers again.`
    };

    if (!confirm(confirmMsg[newStatus] || `Change status to ${newStatus}?`)) return;

    try {
        await apiCall('/vehicles/' + adId + '/status', 'PATCH', {
            status : newStatus,
            user_id: state.currentUser.id
        });

        const statusLabel = { sold: 'Sold', inactive: 'Deactivated', active: 'Re-published' };
        showToast(`Ad ${statusLabel[newStatus] || 'updated'}!`, 'success');

        // Refresh main ads list
        try {
            const freshData = await apiCall('/vehicles');
            state.ads = freshData.data.map(mapRow);
        } catch(e) { /* keep current */ }

        // Refresh inactive list if it's cached
        if (state._inactiveAds !== undefined) {
            try {
                const inactiveData = await apiCall('/vehicles/my-inactive?user_id=' + state.currentUser.id);
                state._inactiveAds = inactiveData.data.map(mapRow);
            } catch(e) { state._inactiveAds = []; }
        }

        if (state.currentView === 'myPosts') {
            showMyPosts();
        } else if (state.currentView === 'inactiveAds') {
            showInactiveAds();
        } else {
            renderAds();
        }
    } catch (err) {
        showToast(err.message || 'Status update failed.', 'error');
    }
}

// ── SHOW INACTIVE ADS PAGE ─────────────────────────────────
async function showInactiveAds() {
    if (!state.currentUser) {
        showToast('Please login to view inactive ads.', 'error');
        return;
    }

    state.currentView = 'inactiveAds';
    const mainContent = document.getElementById('mainContent');

    mainContent.innerHTML = `
        <section class="ads-section" style="padding-top: var(--spacing-xl);">
            <div class="container">
                <div class="section-header">
                    <h2><i class="fas fa-archive" style="margin-right:0.5rem;color:hsl(var(--accent));"></i>Inactive Ads</h2>
                    <p>Your sold or deactivated listings — re-publish any time</p>
                    <div style="display:flex;gap:0.75rem;flex-wrap:wrap;margin-top:var(--spacing-md);">
                        <button class="btn btn-outline" onclick="showMyPosts()">
                            <i class="fas fa-list"></i> My Active Ads
                        </button>
                        <button class="btn btn-outline" onclick="navigateToHome()">
                            <i class="fas fa-home"></i> Home
                        </button>
                    </div>
                </div>
                <div id="inactiveGrid" class="ads-grid">
                    <div style="grid-column:1/-1;text-align:center;padding:3rem;">
                        <i class="fas fa-spinner fa-spin" style="font-size:2rem;color:hsl(var(--accent));"></i>
                        <p style="margin-top:1rem;">Loading...</p>
                    </div>
                </div>
            </div>
        </section>`;

    updateActiveNavLink();

    try {
        const data = await apiCall('/vehicles/my-inactive?user_id=' + state.currentUser.id);
        state._inactiveAds = data.data.map(mapRow);
    } catch(err) {
        state._inactiveAds = [];
        showToast('Could not load inactive ads: ' + err.message, 'error');
    }

    renderInactiveAds();
}

function renderInactiveAds() {
    const grid = document.getElementById('inactiveGrid');
    if (!grid) return;

    const ads = state._inactiveAds || [];

    if (ads.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column:1/-1;">
                <i class="fas fa-box-open"></i>
                <p>No inactive ads yet. When you mark an ad as Sold or Deactivate it, it will appear here.</p>
                <button class="btn btn-primary" onclick="showMyPosts()">
                    <i class="fas fa-list"></i> My Active Ads
                </button>
            </div>`;
        return;
    }

    grid.innerHTML = '';
    ads.forEach(ad => {
        const isSold     = ad.status === 'sold';
        const badgeColor = isSold ? '#ef4444' : '#f59e0b';
        const badgeLabel = isSold ? '🔴 Sold' : '🟡 Inactive';

        const card = document.createElement('div');
        card.className = 'ad-card';
        card.style.opacity = '0.88';
        card.style.position = 'relative';
        card.innerHTML = `
            <div style="position:absolute;top:0.75rem;right:0.75rem;background:${badgeColor};
                        color:#fff;font-size:0.72rem;font-weight:700;padding:0.2rem 0.6rem;
                        border-radius:999px;z-index:2;letter-spacing:0.03em;">${badgeLabel}</div>
            <img src="${ad.image}" alt="${ad.title}" class="ad-image"
                 onerror="this.src='https://placehold.co/400x250/1e293b/94a3b8?text=${encodeURIComponent(ad.title)}'">
            <div class="ad-content">
                <h3 class="ad-title">${ad.title}</h3>
                <div class="ad-price">Rs ${ad.price.toLocaleString()}</div>
                <div class="ad-meta">
                    <span><i class="fas fa-calendar"></i> ${ad.year}</span>
                    <span><i class="fas fa-tachometer-alt"></i> ${ad.kilometers.toLocaleString()} km</span>
                </div>
                <p class="ad-description">${ad.description}</p>
                <div class="ad-actions" style="flex-wrap:wrap;gap:0.5rem;">
                    <button class="btn btn-primary" onclick="markAdStatusDB(${ad.id},'active')"
                            title="Re-publish this ad so buyers can see it">
                        <i class="fas fa-redo"></i> Re-publish
                    </button>
                    <button class="btn btn-outline" onclick="deleteAdDB(${ad.id})"
                            style="border-color:#ef4444;color:#ef4444;" title="Permanently delete">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>`;
        grid.appendChild(card);
    });
}

// ── Override all functions ─────────────────────────────────
window.handleLogin     = handleLoginDB;
window.handleRegister  = handleRegisterDB;
window.handlePublishAd = handlePublishAdDB;
window.deleteAd        = deleteAdDB;
window.logout          = logoutDB;
window.handleEditAdDB  = handleEditAdDB;
window.markAdStatusDB  = markAdStatusDB;
window.showInactiveAds = showInactiveAds;
window.renderInactiveAds = renderInactiveAds;
window.init            = function () { restoreSession(); loadVehiclesFromDB(); };

// ── Start ──────────────────────────────────────────────────
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.init());
} else {
    window.init();
}

// ── Fix myPosts filter & delete to use user_id not name ────
// Override renderAds to use user_id for myPosts filter
const _origRenderAds = window.renderAds;
window.renderAds = function() {
    // Patch: replace seller-name filter with user_id filter for myPosts
    if (state.currentView === 'myPosts' && state.currentUser) {
        const origAds = state.ads;
        const myAds = state.ads.filter(ad =>
            ad.user_id === state.currentUser.id ||
            (ad.seller && state.currentUser.username &&
             ad.seller.toLowerCase() === state.currentUser.username.toLowerCase())
        );
        state.ads = myAds;
        if (typeof _origRenderAds === 'function') _origRenderAds();
        state.ads = origAds; // restore
    } else {
        if (typeof _origRenderAds === 'function') _origRenderAds();
    }
};
