// Countdown Timer
function updateCountdown() {
    const weddingDate = new Date('2026-08-25T16:00:00').getTime();
    const now = new Date().getTime();
    const difference = weddingDate - now;

    if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = days;
        document.getElementById('hours').textContent = hours;
        document.getElementById('minutes').textContent = minutes;
        document.getElementById('seconds').textContent = seconds;
    } else {
        // Wedding day has passed
        document.getElementById('days').textContent = 0;
        document.getElementById('hours').textContent = 0;
        document.getElementById('minutes').textContent = 0;
        document.getElementById('seconds').textContent = 0;
    }
}

// Start countdown and update every second
setInterval(updateCountdown, 1000);
updateCountdown();

// Page Navigation
function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));

    // Show selected page
    document.getElementById(pageId).classList.add('active');

    // Update nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    event.target.classList.add('active');

    // Update mobile page title
    const pageTitles = {
        'home': 'Home',
        'schedule': 'Schedule',
        'travel': 'Travel',
        'dress-code': 'Dress Code',
        'things': 'Things To Do',
        'faqs': 'FAQs',
        'rsvp': 'RSVP'
    };
    const mobileTitle = document.getElementById('mobilePageTitle');
    if (mobileTitle) {
        mobileTitle.textContent = pageTitles[pageId] || 'Home';
    }

    // Close mobile menu if open
    const navContainer = document.getElementById('navContainer');
    navContainer.classList.remove('mobile-open');

    // Scroll to top
    window.scrollTo(0, 0);
}

// Mobile Menu Toggle
function toggleMobileMenu() {
    const navContainer = document.getElementById('navContainer');
    navContainer.classList.toggle('mobile-open');
}

// Weather Widget
async function loadWeather() {
    try {
        // Using OpenWeatherMap API - you'll need to get a free API key
        // For demo purposes, we'll use mock data
        displayMockWeather();
    } catch (error) {
        console.error('Error loading weather:', error);
        displayMockWeather();
    }
}

function celsiusToFahrenheit(celsius) {
    return Math.round((celsius * 9/5) + 32);
}

function displayMockWeather() {
    // Historical weather data for August in Fasano (source: WeatherSpark.com)
    const historicalWeather = {
        avgTemp: 28, // Average of 28°C (83°F high, 69°F low)
        tempRange: { high: 28, low: 21 }, // 83°F = 28°C, 69°F = 21°C
        humidity: 65, // Muggy conditions common
        rainChance: 8, // Very low rainfall (0.8 inches = ~20mm total for month)
        description: 'mostly clear'
    };

    // Wedding event weather expectations (based on historical August averages)
    const weddingEvents = [
        { date: 'Aug 24', event: 'Welcome Party', high: 27, low: 21, desc: 'clear evening' },
        { date: 'Aug 25', event: 'Wedding Day', high: 28, low: 21, desc: 'mostly clear' },
        { date: 'Aug 26', event: 'Beach Day', high: 28, low: 22, desc: 'perfect for beach' }
    ];

    // Update historical weather summary
    const avgTempF = celsiusToFahrenheit(historicalWeather.avgTemp);
    document.getElementById('currentTemp').textContent = `${historicalWeather.avgTemp}°C / ${avgTempF}°F`;
    document.getElementById('weatherDesc').textContent = historicalWeather.description;

    const highF = celsiusToFahrenheit(historicalWeather.tempRange.high);
    const lowF = celsiusToFahrenheit(historicalWeather.tempRange.low);
    document.getElementById('tempRange').textContent = `${historicalWeather.tempRange.high}°/${historicalWeather.tempRange.low}°C (${highF}°/${lowF}°F)`;

    // Update wedding events forecast
    const forecastContainer = document.getElementById('weatherForecast');
    forecastContainer.innerHTML = '';

    weddingEvents.forEach(event => {
        const highF = celsiusToFahrenheit(event.high);
        const lowF = celsiusToFahrenheit(event.low);
        const eventElement = document.createElement('div');
        eventElement.className = 'forecast-day';
        eventElement.innerHTML = `
            <div class="forecast-date">${event.date}</div>
            <div class="forecast-temp">${event.high}°/${event.low}°C<br>${highF}°/${lowF}°F</div>
            <div style="font-size: 0.9rem; margin-top: 0.5rem; opacity: 0.8;">${event.event}</div>
        `;
        forecastContainer.appendChild(eventElement);
    });
}

// Calendar functionality
function addToCalendar(eventType) {
    const events = {
        'rehearsal': {
            title: 'Julie & Samuel - Rehearsal Dinner',
            start: '20260823T190000Z',
            end: '20260823T220000Z',
            location: 'Pizzeria del Portico, Fasano, Italy',
            description: 'Intimate rehearsal dinner for close family members. Join us for authentic Italian pizza and good conversation before the big celebration!'
        },
        'welcome': {
            title: 'Julie & Samuel - Welcome Party',
            start: '20260824T190000Z',
            end: '20260824T230000Z',
            location: 'Mareducato, Savelletri, Italy',
            description: 'Welcome party with open bar (wine and beer) and finger food. For cocktails/Aperol Spritz, drinks available for purchase at the regular bar.'
        },
        'wedding': {
            title: 'Julie & Samuel - Wedding Celebration',
            start: '20260825T160000Z',
            end: '20260826T020000Z',
            location: 'Masseria Alchimia, Fasano, Italy',
            description: 'Our wedding celebration featuring a symbolic ceremony in the olive grove, followed by Apulian BBQ dinner and reception with dancing!'
        },
        'beach': {
            title: 'Julie & Samuel - Beach Day',
            start: '20260826T120000Z',
            end: '20260826T180000Z',
            location: 'Fasano, Italy',
            description: 'Beach day to relax after the wedding celebration.'
        }
    };

    const event = events[eventType];
    if (!event) return;

    // Detect device type
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);

    if (isIOS) {
        // iOS Calendar (opens in Apple Calendar app)
        const icsContent = generateICS(event);
        downloadICS(icsContent, event.title);
    } else if (isAndroid) {
        // Android Google Calendar
        const googleUrl = generateGoogleCalendarUrl(event);
        window.open(googleUrl, '_blank');
    } else {
        // Desktop - show options
        showCalendarOptions(event);
    }
}

function generateICS(event) {
    const ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Julie & Samuel Wedding//EN
BEGIN:VEVENT
UID:${event.start}-${Math.random().toString(36).substr(2, 9)}@wedding
DTSTART:${event.start}
DTEND:${event.end}
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
END:VCALENDAR`;
    return ics;
}

function downloadICS(icsContent, filename) {
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename.replace(/[^a-z0-9]/gi, '_')}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function generateGoogleCalendarUrl(event) {
    const baseUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
    const params = new URLSearchParams({
        text: event.title,
        dates: `${event.start}/${event.end}`,
        details: event.description,
        location: event.location,
        sf: 'true',
        output: 'xml'
    });
    return `${baseUrl}&${params.toString()}`;
}

function showCalendarOptions(event) {
    const googleUrl = generateGoogleCalendarUrl(event);
    const icsContent = generateICS(event);
    
    const modal = document.createElement('div');
    modal.className = 'calendar-modal';
    modal.innerHTML = `
        <div class="calendar-modal-content">
            <h3>Add to Calendar</h3>
            <div class="calendar-options">
                <button onclick="window.open('${googleUrl}', '_blank')" class="btn calendar-btn">
                    📅 Google Calendar
                </button>
                <button onclick="downloadICS(\`${icsContent.replace(/`/g, '\\`')}\`, '${event.title}')" class="btn calendar-btn">
                    📱 Apple Calendar / Outlook
                </button>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" class="btn calendar-close">Close</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// City Tile Toggle
function toggleCityTile(tile) {
    tile.classList.toggle('expanded');
}

// Dress Code Modal
function openDressCodeModal(eventType) {
    const images = {
        'welcome': 'https://i.imgur.com/h6YBju1.png',
        'wedding': 'https://i.imgur.com/40NNJM5.png'
    };

    const titles = {
        'welcome': 'Welcome Party Dress Code',
        'wedding': 'Wedding Day Dress Code'
    };

    const modal = document.createElement('div');
    modal.className = 'dress-code-modal';
    modal.innerHTML = `
        <div class="dress-code-modal-content">
            <button class="dress-code-modal-close" onclick="this.parentElement.parentElement.remove()">✕</button>
            <img src="${images[eventType]}" alt="${titles[eventType]}">
        </div>
    `;

    document.body.appendChild(modal);

    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });

    // Close on ESC key
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
}

// Load weather when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Check if weather widget exists (only on travel page)
    if (document.getElementById('currentTemp')) {
        loadWeather();
    }

    // Load guest list for RSVP
    loadGuestList();

    // Initialize Firebase
    initializeFirebase();
});

// RSVP System
let guestList = [];
let selectedGuest = null;
let selectedPartner = null;
let rsvpForCouple = false;

// Load guest list
async function loadGuestList() {
    try {
        const response = await fetch('guest-list.json');
        guestList = await response.json();
        console.log('Guest list loaded:', guestList.length, 'guests');
    } catch (error) {
        console.error('Error loading guest list:', error);
    }
}

// Name search functionality
const guestNameInput = document.getElementById('guestName');
const nameDropdown = document.getElementById('nameDropdown');

if (guestNameInput) {
    guestNameInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.trim().toLowerCase();

        if (searchTerm.length < 2) {
            nameDropdown.classList.remove('show');
            return;
        }

        // Search for matching guests
        const matches = guestList.filter(guest => {
            return guest.firstName.toLowerCase().includes(searchTerm) ||
                   guest.lastName.toLowerCase().includes(searchTerm) ||
                   guest.fullName.toLowerCase().includes(searchTerm);
        }).slice(0, 10); // Limit to 10 results

        if (matches.length > 0) {
            displayNameMatches(matches);
        } else {
            nameDropdown.classList.remove('show');
        }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!nameDropdown.contains(e.target) && e.target !== guestNameInput) {
            nameDropdown.classList.remove('show');
        }
    });
}

function displayNameMatches(matches) {
    nameDropdown.innerHTML = '';

    matches.forEach(guest => {
        const option = document.createElement('div');
        option.className = 'name-option';
        option.innerHTML = `
            <div class="name-option-name">${guest.fullName}</div>
            ${guest.email ? `<div class="name-option-email">${guest.email}</div>` : ''}
        `;

        option.addEventListener('click', () => selectGuest(guest));
        nameDropdown.appendChild(option);
    });

    nameDropdown.classList.add('show');
}

function selectGuest(guest) {
    selectedGuest = guest;
    guestNameInput.value = guest.fullName;
    nameDropdown.classList.remove('show');

    // Check if guest has a partner
    if (guest.groupId) {
        const partner = guestList.find(g => g.groupId === guest.groupId && g.id !== guest.id);
        if (partner) {
            selectedPartner = partner;
            showPartnerPrompt(partner);
            return;
        }
    }

    // No partner, show continue button
    selectedPartner = null;
    document.getElementById('partnerPrompt').style.display = 'none';
    document.getElementById('continueBtn').style.display = 'block';
}

function showPartnerPrompt(partner) {
    document.getElementById('partnerName').textContent = partner.fullName;
    document.getElementById('partnerPrompt').style.display = 'block';
    document.getElementById('continueBtn').style.display = 'none';
}

function rsvpForBoth() {
    rsvpForCouple = true;
    document.getElementById('continueBtn').style.display = 'block';
}

function rsvpForOne() {
    rsvpForCouple = false;
    selectedPartner = null;
    document.getElementById('continueBtn').style.display = 'block';
}

function continueToRsvp() {
    // Hide step 1, show step 2
    document.getElementById('rsvpStep1').classList.remove('active');
    document.getElementById('rsvpStep2').classList.add('active');

    // Set up the form
    document.getElementById('guest1Name').textContent = selectedGuest.fullName;

    if (rsvpForCouple && selectedPartner) {
        document.getElementById('guest2Section').style.display = 'block';
        document.getElementById('guest2Name').textContent = selectedPartner.fullName;
    } else {
        document.getElementById('guest2Section').style.display = 'none';
    }

    // Scroll to top
    window.scrollTo(0, 0);
}

function goBackToStep1() {
    document.getElementById('rsvpStep2').classList.remove('active');
    document.getElementById('rsvpStep1').classList.add('active');

    // Reset form
    document.getElementById('rsvpForm').reset();

    // Scroll to top
    window.scrollTo(0, 0);
}

async function submitRsvp(event) {
    event.preventDefault();

    // Collect form data
    const rsvpData = {
        timestamp: new Date().toISOString(),
        guest1: {
            id: selectedGuest.id,
            name: selectedGuest.fullName,
            email: selectedGuest.email,
            events: {
                welcomeParty: document.getElementById('guest1_welcomeParty').checked,
                wedding: document.getElementById('guest1_wedding').checked,
                beach: document.getElementById('guest1_beach').checked
            },
            dietary: document.getElementById('guest1_dietary').value,
            notes: document.getElementById('guest1_notes').value
        }
    };

    if (rsvpForCouple && selectedPartner) {
        rsvpData.guest2 = {
            id: selectedPartner.id,
            name: selectedPartner.fullName,
            email: selectedPartner.email,
            events: {
                welcomeParty: document.getElementById('guest2_welcomeParty').checked,
                wedding: document.getElementById('guest2_wedding').checked,
                beach: document.getElementById('guest2_beach').checked
            },
            dietary: document.getElementById('guest2_dietary').value,
            notes: document.getElementById('guest2_notes').value
        };
    }

    // Save to Firebase
    try {
        await saveRsvpToFirebase(rsvpData);

        // Show success message
        document.getElementById('rsvpStep2').classList.remove('active');
        document.getElementById('rsvpStep3').classList.add('active');
        window.scrollTo(0, 0);
    } catch (error) {
        console.error('Error submitting RSVP:', error);
        alert('There was an error submitting your RSVP. Please try again or contact us directly.');
    }
}

function resetRsvp() {
    // Reset all variables
    selectedGuest = null;
    selectedPartner = null;
    rsvpForCouple = false;

    // Reset form
    document.getElementById('guestName').value = '';
    document.getElementById('rsvpForm').reset();
    document.getElementById('partnerPrompt').style.display = 'none';
    document.getElementById('continueBtn').style.display = 'none';

    // Go back to step 1
    document.getElementById('rsvpStep3').classList.remove('active');
    document.getElementById('rsvpStep1').classList.add('active');

    window.scrollTo(0, 0);
}

// Firebase Integration
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

let firebaseInitialized = false;

async function initializeFirebase() {
    if (firebaseInitialized) return;

    try {
        // Check if Firebase is available
        if (typeof firebase !== 'undefined') {
            firebase.initializeApp(firebaseConfig);
            firebaseInitialized = true;
            console.log('Firebase initialized');
        }
    } catch (error) {
        console.error('Error initializing Firebase:', error);
    }
}

async function saveRsvpToFirebase(rsvpData) {
    // For now, just log the data (Firebase will be set up separately)
    console.log('RSVP Data to save:', rsvpData);

    // If Firebase is configured and initialized
    if (firebaseInitialized && typeof firebase !== 'undefined') {
        try {
            const db = firebase.database();
            const rsvpRef = db.ref('rsvps');
            await rsvpRef.push(rsvpData);
            console.log('RSVP saved to Firebase');
        } catch (error) {
            console.error('Error saving to Firebase:', error);
            throw error;
        }
    } else {
        // For testing without Firebase, just simulate success
        console.log('Firebase not configured. RSVP would be saved here.');
        // Simulate async delay
        await new Promise(resolve => setTimeout(resolve, 500));
    }
}