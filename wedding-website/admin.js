// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCvErGfvB9uVDDbbXM8ADAFJcibW4vLSvM",
    authDomain: "weddingrsvp-3d7a2.firebaseapp.com",
    databaseURL: "https://weddingrsvp-3d7a2-default-rtdb.firebaseio.com",
    projectId: "weddingrsvp-3d7a2",
    storageBucket: "weddingrsvp-3d7a2.firebasestorage.app",
    messagingSenderId: "720591735375",
    appId: "1:720591735375:web:b9356360b0d7436497b83a",
    measurementId: "G-ZWYDH5G56B"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Simple password (you can change this)
const ADMIN_PASSWORD = "wedding2026";

let allRsvps = [];
let isLoggedIn = false;

// Check if already logged in
document.addEventListener('DOMContentLoaded', function() {
    const loggedIn = sessionStorage.getItem('adminLoggedIn');
    if (loggedIn === 'true') {
        showDashboard();
    }
});

// Login function
function login(event) {
    event.preventDefault();

    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('loginError');

    console.log('Password entered:', password);
    console.log('Expected password:', ADMIN_PASSWORD);
    console.log('Match:', password === ADMIN_PASSWORD);

    if (password === ADMIN_PASSWORD) {
        console.log('Login successful!');
        sessionStorage.setItem('adminLoggedIn', 'true');
        isLoggedIn = true;
        showDashboard();
    } else {
        console.log('Login failed!');
        errorDiv.textContent = 'Incorrect password. Please try again.';
        errorDiv.style.display = 'block';
        document.getElementById('password').value = '';
    }
}

// Logout function
function logout() {
    sessionStorage.removeItem('adminLoggedIn');
    isLoggedIn = false;
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('dashboard').classList.remove('active');
    document.getElementById('password').value = '';
}

// Show dashboard
function showDashboard() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('dashboard').classList.add('active');
    loadRsvps();
}

// Load RSVPs from Firebase
function loadRsvps() {
    const rsvpsRef = database.ref('rsvps');

    rsvpsRef.on('value', (snapshot) => {
        const data = snapshot.val();

        if (!data) {
            showEmptyState();
            return;
        }

        // Convert to array
        allRsvps = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
        }));

        displayStats();
        displayRsvpTable();
        displayDietaryRestrictions();
    }, (error) => {
        console.error('Error loading RSVPs:', error);
        showError('Error loading RSVPs. Please check your Firebase security rules.');
    });
}

// Get the latest RSVP data for each guest
function getLatestGuestData() {
    // Map to store the latest RSVP info for each guest ID
    const latestGuestMap = new Map();

    // Build a map of all RSVPs with timestamps
    const rsvpsWithTime = allRsvps.map(rsvp => ({
        ...rsvp,
        time: new Date(rsvp.timestamp || 0).getTime()
    }));

    // Sort by timestamp (oldest first, so newer ones overwrite)
    rsvpsWithTime.sort((a, b) => a.time - b.time);

    // Process each RSVP and extract guest data
    rsvpsWithTime.forEach(rsvp => {
        if (rsvp.guest1) {
            // Store or update guest1 data with RSVP info
            latestGuestMap.set(rsvp.guest1.id, {
                guest: rsvp.guest1,
                isUpdate: rsvp.isUpdate || false,
                rsvpId: rsvp.id,
                timestamp: rsvp.timestamp
            });
        }

        if (rsvp.guest2) {
            // Store or update guest2 data with RSVP info
            latestGuestMap.set(rsvp.guest2.id, {
                guest: rsvp.guest2,
                isUpdate: rsvp.isUpdate || false,
                rsvpId: rsvp.id,
                timestamp: rsvp.timestamp
            });
        }
    });

    // Convert map to array of guest data
    return Array.from(latestGuestMap.values());
}

// Display statistics
function displayStats() {
    let totalGuests = 0;
    let rehearsalCount = 0;
    let welcomeCount = 0;
    let weddingCount = 0;
    let beachCount = 0;

    // Get latest data for each guest
    const latestGuestData = getLatestGuestData();

    latestGuestData.forEach(guestData => {
        const guest = guestData.guest;
        totalGuests++;

        if (guest.events.rehearsalDinner) rehearsalCount++;
        if (guest.events.welcomeParty) welcomeCount++;
        if (guest.events.wedding) weddingCount++;
        if (guest.events.beach) beachCount++;
    });

    document.getElementById('totalRsvps').textContent = totalGuests;
    document.getElementById('rehearsalCount').textContent = rehearsalCount;
    document.getElementById('welcomeCount').textContent = welcomeCount;
    document.getElementById('weddingCount').textContent = weddingCount;
    document.getElementById('beachCount').textContent = beachCount;
}

// Display RSVP table
function displayRsvpTable() {
    const container = document.getElementById('rsvpTableContainer');

    // Get latest data for each guest
    const latestGuestData = getLatestGuestData();

    if (latestGuestData.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📭</div><p>No RSVPs yet</p></div>';
        return;
    }

    let html = `
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Rehearsal</th>
                    <th>Welcome Party</th>
                    <th>Wedding</th>
                    <th>Beach Day</th>
                    <th>Dietary</th>
                    <th>Notes</th>
                </tr>
            </thead>
            <tbody>
    `;

    latestGuestData.forEach(guestData => {
        html += createTableRow(guestData.guest, guestData.isUpdate);
    });

    html += '</tbody></table>';
    container.innerHTML = html;
}

// Create table row for a guest
function createTableRow(guest, isUpdate) {
    const updateBadge = isUpdate ? ' <span class="badge" style="background: #ffc107; color: #000; font-size: 0.7rem;">Updated</span>' : '';

    return `
        <tr>
            <td><strong>${guest.name}</strong>${updateBadge}</td>
            <td>${guest.email || '-'}</td>
            <td>${getBadge(guest.events.rehearsalDinner)}</td>
            <td>${getBadge(guest.events.welcomeParty)}</td>
            <td>${getBadge(guest.events.wedding)}</td>
            <td>${getBadge(guest.events.beach)}</td>
            <td>${formatDietaryRestrictions(guest.dietary)}</td>
            <td>${guest.notes || '-'}</td>
        </tr>
    `;
}

// Get badge HTML
function getBadge(value) {
    if (value) {
        return '<span class="badge badge-yes">Yes</span>';
    } else {
        return '<span class="badge badge-no">No</span>';
    }
}

// Format dietary restrictions for display
function formatDietaryRestrictions(dietary) {
    if (!dietary) return '-';

    // Handle old format (plain string)
    if (typeof dietary === 'string') {
        return dietary;
    }

    // Handle new format (object with checkboxes)
    const restrictions = [];
    if (dietary.vegan) restrictions.push('Vegan');
    if (dietary.vegetarian) restrictions.push('Vegetarian');
    if (dietary.glutenFree) restrictions.push('Gluten Free');
    if (dietary.other && dietary.other.trim()) restrictions.push(dietary.other);

    return restrictions.length > 0 ? restrictions.join(', ') : '-';
}

// Display dietary restrictions
function displayDietaryRestrictions() {
    const list = document.getElementById('dietaryList');
    const dietary = [];

    // Get latest data for each guest
    const latestGuestData = getLatestGuestData();

    latestGuestData.forEach(guestData => {
        const guest = guestData.guest;
        if (guest.dietary) {
            dietary.push({
                name: guest.name,
                dietary: guest.dietary
            });
        }
    });

    if (dietary.length === 0) {
        list.innerHTML = '<li style="text-align: center; color: #999;">No dietary restrictions reported</li>';
        return;
    }

    let html = '';
    dietary.forEach(item => {
        html += `<li><strong>${item.name}:</strong> ${formatDietaryRestrictions(item.dietary)}</li>`;
    });

    list.innerHTML = html;
}

// Export to CSV
function exportToCSV() {
    // Get latest data for each guest
    const latestGuestData = getLatestGuestData();

    if (latestGuestData.length === 0) {
        alert('No RSVPs to export');
        return;
    }

    let csv = 'Name,Email,Rehearsal Dinner,Welcome Party,Wedding,Beach Day,Dietary Restrictions,Notes\n';

    latestGuestData.forEach(guestData => {
        csv += createCSVRow(guestData.guest);
    });

    // Create download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wedding-rsvps-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Create CSV row
function createCSVRow(guest) {
    const escapeCSV = (str) => {
        if (!str) return '';
        str = String(str);
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return '"' + str.replace(/"/g, '""') + '"';
        }
        return str;
    };

    return `${escapeCSV(guest.name)},${escapeCSV(guest.email)},${guest.events.rehearsalDinner ? 'Yes' : 'No'},${guest.events.welcomeParty ? 'Yes' : 'No'},${guest.events.wedding ? 'Yes' : 'No'},${guest.events.beach ? 'Yes' : 'No'},${escapeCSV(formatDietaryRestrictions(guest.dietary))},${escapeCSV(guest.notes)}\n`;
}

// Refresh data
function refreshData() {
    document.getElementById('rsvpTableContainer').innerHTML = '<div class="loading"><div class="spinner"></div><p>Loading RSVPs...</p></div>';
    document.getElementById('dietaryList').innerHTML = '<div class="loading"><div class="spinner"></div><p>Loading dietary information...</p></div>';
    loadRsvps();
}

// Show empty state
function showEmptyState() {
    document.getElementById('totalRsvps').textContent = '0';
    document.getElementById('rehearsalCount').textContent = '0';
    document.getElementById('welcomeCount').textContent = '0';
    document.getElementById('weddingCount').textContent = '0';
    document.getElementById('beachCount').textContent = '0';

    document.getElementById('rsvpTableContainer').innerHTML = '<div class="empty-state"><div class="empty-state-icon">📭</div><p>No RSVPs yet. Guests can submit their RSVPs on the main website.</p></div>';
    document.getElementById('dietaryList').innerHTML = '<li style="text-align: center; color: #999;">No dietary restrictions reported</li>';
}

// Show error
function showError(message) {
    document.getElementById('rsvpTableContainer').innerHTML = `<div class="empty-state"><div class="empty-state-icon">⚠️</div><p>${message}</p></div>`;
}
