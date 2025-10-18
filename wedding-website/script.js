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

function displayMockWeather() {
    // Historical weather data for August in Fasano (source: WeatherSpark.com)
    const historicalWeather = {
        avgTemp: 28, // Average of 28°C (83°F high, 69°F low)
        tempRange: '28°/21°', // 83°F = 28°C, 69°F = 21°C
        humidity: 65, // Muggy conditions common
        rainChance: 8, // Very low rainfall (0.8 inches = ~20mm total for month)
        description: 'mostly clear'
    };

    // Wedding event weather expectations (based on historical August averages)
    const weddingEvents = [
        { date: 'Aug 24', event: 'Welcome Party', temp: '27°/21°', desc: 'clear evening' },
        { date: 'Aug 25', event: 'Wedding Day', temp: '28°/21°', desc: 'mostly clear' },
        { date: 'Aug 26', event: 'Beach Day', temp: '28°/22°', desc: 'perfect for beach' }
    ];

    // Update historical weather summary
    document.getElementById('currentTemp').textContent = `${historicalWeather.avgTemp}°C`;
    document.getElementById('weatherDesc').textContent = historicalWeather.description;
    document.getElementById('tempRange').textContent = historicalWeather.tempRange;
    document.getElementById('humidity').textContent = `${historicalWeather.humidity}%`;
    document.getElementById('rainChance').textContent = `${historicalWeather.rainChance}%`;

    // Update wedding events forecast
    const forecastContainer = document.getElementById('weatherForecast');
    forecastContainer.innerHTML = '';
    
    weddingEvents.forEach(event => {
        const eventElement = document.createElement('div');
        eventElement.className = 'forecast-day';
        eventElement.innerHTML = `
            <div class="forecast-date">${event.date}</div>
            <div class="forecast-temp">${event.temp}</div>
            <div class="forecast-desc">${event.desc}</div>
            <div style="font-size: 0.7rem; margin-top: 0.25rem; opacity: 0.6;">${event.event}</div>
        `;
        forecastContainer.appendChild(eventElement);
    });
}

// Calendar functionality
function addToCalendar(eventType) {
    const events = {
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

// Load weather when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Check if weather widget exists (only on travel page)
    if (document.getElementById('currentTemp')) {
        loadWeather();
    }
});