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

// Display statistics
function displayStats() {
    let totalGuests = 0;
    let welcomeCount = 0;
    let weddingCount = 0;
    let beachCount = 0;

    allRsvps.forEach(rsvp => {
        // Guest 1
        if (rsvp.guest1) {
            totalGuests++;
            if (rsvp.guest1.events.welcomeParty) welcomeCount++;
            if (rsvp.guest1.events.wedding) weddingCount++;
            if (rsvp.guest1.events.beach) beachCount++;
        }

        // Guest 2 (if couple)
        if (rsvp.guest2) {
            totalGuests++;
            if (rsvp.guest2.events.welcomeParty) welcomeCount++;
            if (rsvp.guest2.events.wedding) weddingCount++;
            if (rsvp.guest2.events.beach) beachCount++;
        }
    });

    document.getElementById('totalRsvps').textContent = totalGuests;
    document.getElementById('welcomeCount').textContent = welcomeCount;
    document.getElementById('weddingCount').textContent = weddingCount;
    document.getElementById('beachCount').textContent = beachCount;
}

// Display RSVP table
function displayRsvpTable() {
    const container = document.getElementById('rsvpTableContainer');

    if (allRsvps.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📭</div><p>No RSVPs yet</p></div>';
        return;
    }

    let html = `
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Welcome Party</th>
                    <th>Wedding</th>
                    <th>Beach Day</th>
                    <th>Dietary</th>
                    <th>Notes</th>
                </tr>
            </thead>
            <tbody>
    `;

    allRsvps.forEach(rsvp => {
        // Guest 1
        if (rsvp.guest1) {
            html += createTableRow(rsvp.guest1);
        }

        // Guest 2
        if (rsvp.guest2) {
            html += createTableRow(rsvp.guest2);
        }
    });

    html += '</tbody></table>';
    container.innerHTML = html;
}

// Create table row for a guest
function createTableRow(guest) {
    return `
        <tr>
            <td><strong>${guest.name}</strong></td>
            <td>${guest.email || '-'}</td>
            <td>${getBadge(guest.events.welcomeParty)}</td>
            <td>${getBadge(guest.events.wedding)}</td>
            <td>${getBadge(guest.events.beach)}</td>
            <td>${guest.dietary || '-'}</td>
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

// Display dietary restrictions
function displayDietaryRestrictions() {
    const list = document.getElementById('dietaryList');
    const dietary = [];

    allRsvps.forEach(rsvp => {
        if (rsvp.guest1 && rsvp.guest1.dietary) {
            dietary.push({
                name: rsvp.guest1.name,
                dietary: rsvp.guest1.dietary
            });
        }

        if (rsvp.guest2 && rsvp.guest2.dietary) {
            dietary.push({
                name: rsvp.guest2.name,
                dietary: rsvp.guest2.dietary
            });
        }
    });

    if (dietary.length === 0) {
        list.innerHTML = '<li style="text-align: center; color: #999;">No dietary restrictions reported</li>';
        return;
    }

    let html = '';
    dietary.forEach(item => {
        html += `<li><strong>${item.name}:</strong> ${item.dietary}</li>`;
    });

    list.innerHTML = html;
}

// Export to CSV
function exportToCSV() {
    if (allRsvps.length === 0) {
        alert('No RSVPs to export');
        return;
    }

    let csv = 'Name,Email,Welcome Party,Wedding,Beach Day,Dietary Restrictions,Notes\n';

    allRsvps.forEach(rsvp => {
        if (rsvp.guest1) {
            csv += createCSVRow(rsvp.guest1);
        }
        if (rsvp.guest2) {
            csv += createCSVRow(rsvp.guest2);
        }
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

    return `${escapeCSV(guest.name)},${escapeCSV(guest.email)},${guest.events.welcomeParty ? 'Yes' : 'No'},${guest.events.wedding ? 'Yes' : 'No'},${guest.events.beach ? 'Yes' : 'No'},${escapeCSV(guest.dietary)},${escapeCSV(guest.notes)}\n`;
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
