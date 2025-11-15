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
    const isGerman = document.documentElement.lang === 'de';

    const pageTitles = isGerman ? {
        'home': 'Startseite',
        'schedule': 'Zeitplan',
        'travel': 'Reise',
        'dress-code': 'Dresscode',
        'things': 'Unternehmungen',
        'faqs': 'FAQs',
        'rsvp': 'RSVP'
    } : {
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
        mobileTitle.textContent = pageTitles[pageId] || (isGerman ? 'Startseite' : 'Home');
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
let existingRsvp = null; // Store existing RSVP data for pre-filling

// Load guest list
async function loadGuestList() {
    try {
        // Try loading from current directory first
        let response = await fetch('guest-list.json');

        // If in a subdirectory (like /de/), try parent directory
        if (!response.ok) {
            response = await fetch('../guest-list.json');
        }

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

// Check if guest has already RSVP'd
async function checkExistingRsvp(guest) {
    if (typeof firebase === 'undefined' || !firebase.apps.length) {
        return; // Firebase not initialized yet
    }

    try {
        const db = firebase.database();
        const rsvpsRef = db.ref('rsvps');
        const snapshot = await rsvpsRef.once('value');
        const allRsvpsData = snapshot.val();

        if (!allRsvpsData) {
            existingRsvp = null;
            return;
        }

        // Convert to array with IDs
        const allRsvps = Object.keys(allRsvpsData).map(key => ({
            id: key,
            ...allRsvpsData[key]
        }));

        // Find ALL RSVPs for this guest
        const guestRsvps = allRsvps.filter(rsvp => {
            return (rsvp.guest1 && rsvp.guest1.id === guest.id) ||
                   (rsvp.guest2 && rsvp.guest2.id === guest.id);
        });

        if (guestRsvps.length === 0) {
            existingRsvp = null;
            return;
        }

        // Build set of superseded RSVP IDs
        const supersededIds = new Set();
        allRsvps.forEach(rsvp => {
            if (rsvp.previousRsvpId) {
                supersededIds.add(rsvp.previousRsvpId);
            }
        });

        // Filter out superseded RSVPs to get the latest one
        const latestRsvps = guestRsvps.filter(rsvp => !supersededIds.has(rsvp.id));

        if (latestRsvps.length > 0) {
            // Should be exactly 1, but take the most recent by timestamp if multiple
            const mostRecent = latestRsvps.sort((a, b) => {
                const timeA = new Date(a.timestamp || 0).getTime();
                const timeB = new Date(b.timestamp || 0).getTime();
                return timeB - timeA;
            })[0];

            existingRsvp = {
                id: mostRecent.id,
                data: mostRecent
            };
            console.log('Found latest RSVP:', existingRsvp);
        } else {
            existingRsvp = null;
        }
    } catch (error) {
        console.error('Error checking existing RSVP:', error);
        existingRsvp = null;
    }
}

async function selectGuest(guest) {
    selectedGuest = guest;
    guestNameInput.value = guest.fullName;
    nameDropdown.classList.remove('show');

    // Check for existing RSVP
    await checkExistingRsvp(guest);

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

    // Check if there's an existing RSVP message element, if not create it
    let existingMessage = document.getElementById('existingRsvpMessage');
    if (!existingMessage) {
        existingMessage = document.createElement('div');
        existingMessage.id = 'existingRsvpMessage';
        existingMessage.style.cssText = 'background: #fff5f3; border: 2px solid #E47B6A; border-radius: 8px; padding: 1rem; margin-bottom: 2rem; text-align: center; color: #333;';
        const formTitle = document.querySelector('#rsvpStep2 h3');
        formTitle.parentNode.insertBefore(existingMessage, formTitle.nextSibling);
    }

    // Show/hide existing RSVP message
    if (existingRsvp) {
        existingMessage.innerHTML = '<strong>You\'ve already RSVP\'d!</strong><br>Feel free to update your response below.';
        existingMessage.style.display = 'block';

        // Pre-fill the form with existing data
        preFillForm();
    } else {
        existingMessage.style.display = 'none';
    }

    if (rsvpForCouple && selectedPartner) {
        document.getElementById('guest2Section').style.display = 'block';
        document.getElementById('guest2Name').textContent = selectedPartner.fullName;
    } else {
        document.getElementById('guest2Section').style.display = 'none';
    }

    // Scroll to top
    window.scrollTo(0, 0);
}

// Pre-fill form with existing RSVP data
function preFillForm() {
    if (!existingRsvp || !existingRsvp.data) return;

    const rsvpData = existingRsvp.data;

    // Find which guest is the current selected guest
    let guestData = null;
    let partnerData = null;

    if (rsvpData.guest1 && rsvpData.guest1.id === selectedGuest.id) {
        guestData = rsvpData.guest1;
        partnerData = rsvpData.guest2;
    } else if (rsvpData.guest2 && rsvpData.guest2.id === selectedGuest.id) {
        guestData = rsvpData.guest2;
        partnerData = rsvpData.guest1;
    }

    if (guestData) {
        // Pre-fill guest 1 (current selected guest)
        if (guestData.events) {
            const rehearsalCheckbox = document.getElementById('guest1_rehearsal');
            if (rehearsalCheckbox) rehearsalCheckbox.checked = guestData.events.rehearsalDinner || false;

            document.getElementById('guest1_welcomeParty').checked = guestData.events.welcomeParty || false;
            document.getElementById('guest1_wedding').checked = guestData.events.wedding || false;
            document.getElementById('guest1_beach').checked = guestData.events.beach || false;
        }

        // Handle dietary restrictions (both old string format and new object format)
        if (guestData.dietary) {
            if (typeof guestData.dietary === 'object') {
                // New format with checkboxes
                document.getElementById('guest1_vegan').checked = guestData.dietary.vegan || false;
                document.getElementById('guest1_vegetarian').checked = guestData.dietary.vegetarian || false;
                document.getElementById('guest1_glutenFree').checked = guestData.dietary.glutenFree || false;
                document.getElementById('guest1_dietary_other').value = guestData.dietary.other || '';
            } else {
                // Old format (plain text) - put it in the "other" field
                document.getElementById('guest1_dietary_other').value = guestData.dietary;
            }
        }

        document.getElementById('guest1_notes').value = guestData.notes || '';
    }

    // If RSVP'ing for couple and partner data exists
    if (rsvpForCouple && partnerData && selectedPartner && partnerData.id === selectedPartner.id) {
        if (partnerData.events) {
            const rehearsal2Checkbox = document.getElementById('guest2_rehearsal');
            if (rehearsal2Checkbox) rehearsal2Checkbox.checked = partnerData.events.rehearsalDinner || false;

            document.getElementById('guest2_welcomeParty').checked = partnerData.events.welcomeParty || false;
            document.getElementById('guest2_wedding').checked = partnerData.events.wedding || false;
            document.getElementById('guest2_beach').checked = partnerData.events.beach || false;
        }

        // Handle dietary restrictions (both old string format and new object format)
        if (partnerData.dietary) {
            if (typeof partnerData.dietary === 'object') {
                // New format with checkboxes
                document.getElementById('guest2_vegan').checked = partnerData.dietary.vegan || false;
                document.getElementById('guest2_vegetarian').checked = partnerData.dietary.vegetarian || false;
                document.getElementById('guest2_glutenFree').checked = partnerData.dietary.glutenFree || false;
                document.getElementById('guest2_dietary_other').value = partnerData.dietary.other || '';
            } else {
                // Old format (plain text) - put it in the "other" field
                document.getElementById('guest2_dietary_other').value = partnerData.dietary;
            }
        }

        document.getElementById('guest2_notes').value = partnerData.notes || '';
    }
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

    // Collect form data for guest 1
    const guest1Events = {
        welcomeParty: document.getElementById('guest1_welcomeParty').checked,
        wedding: document.getElementById('guest1_wedding').checked,
        beach: document.getElementById('guest1_beach').checked
    };

    // Add rehearsal dinner if checkbox exists (family page only)
    const rehearsalCheckbox = document.getElementById('guest1_rehearsal');
    if (rehearsalCheckbox) {
        guest1Events.rehearsalDinner = rehearsalCheckbox.checked;
    }

    // Collect dietary restrictions for guest 1
    const guest1DietaryOther = document.getElementById('guest1_dietary_other');
    const guest1Vegan = document.getElementById('guest1_vegan');
    const guest1Vegetarian = document.getElementById('guest1_vegetarian');
    const guest1GlutenFree = document.getElementById('guest1_glutenFree');

    const guest1Dietary = {
        vegan: guest1Vegan ? guest1Vegan.checked : false,
        vegetarian: guest1Vegetarian ? guest1Vegetarian.checked : false,
        glutenFree: guest1GlutenFree ? guest1GlutenFree.checked : false,
        other: guest1DietaryOther ? guest1DietaryOther.value : ''
    };

    const rsvpData = {
        timestamp: new Date().toISOString(),
        isUpdate: existingRsvp ? true : false,
        previousRsvpId: existingRsvp ? existingRsvp.id : null,
        guest1: {
            id: selectedGuest.id,
            name: selectedGuest.fullName,
            email: selectedGuest.email,
            events: guest1Events,
            dietary: guest1Dietary,
            notes: document.getElementById('guest1_notes').value
        }
    };

    if (rsvpForCouple && selectedPartner) {
        const guest2Events = {
            welcomeParty: document.getElementById('guest2_welcomeParty').checked,
            wedding: document.getElementById('guest2_wedding').checked,
            beach: document.getElementById('guest2_beach').checked
        };

        // Add rehearsal dinner for guest 2 if checkbox exists
        const rehearsal2Checkbox = document.getElementById('guest2_rehearsal');
        if (rehearsal2Checkbox) {
            guest2Events.rehearsalDinner = rehearsal2Checkbox.checked;
        }

        // Collect dietary restrictions for guest 2
        const guest2DietaryOther = document.getElementById('guest2_dietary_other');
        const guest2Vegan = document.getElementById('guest2_vegan');
        const guest2Vegetarian = document.getElementById('guest2_vegetarian');
        const guest2GlutenFree = document.getElementById('guest2_glutenFree');

        const guest2Dietary = {
            vegan: guest2Vegan ? guest2Vegan.checked : false,
            vegetarian: guest2Vegetarian ? guest2Vegetarian.checked : false,
            glutenFree: guest2GlutenFree ? guest2GlutenFree.checked : false,
            other: guest2DietaryOther ? guest2DietaryOther.value : ''
        };

        rsvpData.guest2 = {
            id: selectedPartner.id,
            name: selectedPartner.fullName,
            email: selectedPartner.email,
            events: guest2Events,
            dietary: guest2Dietary,
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
    existingRsvp = null; // Clear existing RSVP data

    // Reset form
    document.getElementById('guestName').value = '';
    document.getElementById('rsvpForm').reset();
    document.getElementById('partnerPrompt').style.display = 'none';
    document.getElementById('continueBtn').style.display = 'none';

    // Hide existing RSVP message if it exists
    const existingMessage = document.getElementById('existingRsvpMessage');
    if (existingMessage) {
        existingMessage.style.display = 'none';
    }

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