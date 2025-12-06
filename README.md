# Wedding Website - Julie & Samuel

A custom wedding website for our celebration in Puglia, Italy on August 25, 2026.

## Features

- **Multi-language support**: English and German versions
- **Event schedule**: Details for Welcome Party, Wedding Celebration, and Beach Day
- **RSVP system**: Firebase-powered guest management
- **Travel information**: Flight details, accommodations, and local activities
- **Dress code guide**: Visual dress code recommendations with Pinterest inspiration
- **Things to do**: Interactive collapsible sections with clickable tiles for activities and recommendations
- **Countdown timer**: Live countdown to the wedding day
- **Responsive design**: Mobile-first design that works on all devices

## Tech Stack

- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Backend**: Firebase Realtime Database
- **Hosting**: Netlify
- **Fonts**: Google Fonts (Crimson Text, Open Sans, Homemade Apple)

## Project Structure

```
wedding-website/
├── index.html              # Main English homepage
├── family.html             # English family page (includes Rehearsal Dinner)
├── admin.html              # Admin dashboard for viewing RSVPs
├── de/
│   ├── index.html          # German homepage
│   └── family.html         # German family page
├── styles.css              # All website styles
├── script.js               # Main JavaScript functionality
├── admin.js                # Admin dashboard functionality
├── guest-list.json         # Guest list data
└── guest-list.csv          # Guest list in CSV format
```

## Setup

### Local Development

1. Clone the repository
2. Start a local server:
   ```bash
   python3 -m http.server 8080
   ```
3. Open `http://localhost:8080` in your browser

### Firebase Configuration

The website uses Firebase Realtime Database for RSVP management. Firebase configuration is included in:
- `script.js` (guest RSVP submission)
- `admin.js` (admin dashboard)

### Guest List

Guest data is stored in `guest-list.json` with the following structure:
```json
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  "fullName": "John Doe",
  "email": "john@example.com",
  "groupId": "couple1"
}
```

## Pages

### Main Pages (index.html)
- Home: Story and countdown
- Schedule: Event details and times
- Travel: Transportation and accommodation info
- Dress Code: Visual dress code guide
- Things To Do: City trips, activities, and culinary experiences
- FAQs: Common questions
- RSVP: Guest response form

### Family Pages (family.html)
- Includes all main page content
- Additional Rehearsal Dinner event

### Admin Dashboard (admin.html)
- View all RSVPs
- Filter by event attendance
- Export data to CSV
- Real-time updates from Firebase

## Customization

### Colors
The main brand color is salmon/coral: `#E47B6A`

### Images
Images are hosted on Imgur and referenced via URLs in the HTML.

### Content
- Event details: Update in each HTML file's schedule section
- Travel information: Update in the travel page section
- Activities: Update collapsible sections in Things To Do page

## Deployment

The site is configured for Netlify deployment:
1. Push changes to the repository
2. Netlify automatically deploys from the main branch
3. Custom domain can be configured in Netlify settings

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Responsive breakpoints at 768px and 480px

## Credits

Designed and developed by Julie & Samuel

Built with assistance from Claude (Anthropic)
