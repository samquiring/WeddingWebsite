# Firebase Setup Guide for Wedding RSVP

This guide will help you set up Firebase to store your wedding RSVP responses.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter a project name (e.g., "Julie-Samuel-Wedding")
4. Click "Continue"
5. You can disable Google Analytics (not needed for this project)
6. Click "Create project"
7. Wait for the project to be created, then click "Continue"

## Step 2: Set Up Realtime Database

1. In the Firebase Console, click on "Realtime Database" in the left sidebar
2. Click "Create Database"
3. Choose a location (preferably close to where most guests will be)
4. Start in **"test mode"** for now (we'll secure it later)
5. Click "Enable"

## Step 3: Get Your Firebase Configuration

1. In the Firebase Console, click the gear icon (⚙️) next to "Project Overview"
2. Click "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon (</>) to add a web app
5. Give your app a nickname (e.g., "Wedding Website")
6. **DO NOT** check "Also set up Firebase Hosting" (you can host elsewhere)
7. Click "Register app"
8. Copy the `firebaseConfig` object that appears

It will look something like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com"
};
```

## Step 4: Update Your Website Code

1. Open the file `script.js`
2. Find the section that says `// Firebase Integration` (around line 521)
3. Replace the placeholder `firebaseConfig` with your actual configuration:

```javascript
// Replace this:
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    databaseURL: "YOUR_DATABASE_URL"
};

// With your actual config from Firebase Console
```

## Step 5: Test the RSVP Form

1. Open your website in a browser
2. Go to the RSVP page
3. Try submitting a test RSVP
4. Check the browser console (F12) - you should see "RSVP saved to Firebase"
5. Go to Firebase Console → Realtime Database
6. You should see your test RSVP data appear under "rsvps"

## Step 6: Secure Your Database (IMPORTANT!)

After testing, you need to secure your database so only you can read the RSVPs:

1. In Firebase Console, go to "Realtime Database"
2. Click the "Rules" tab
3. Replace the rules with:

```json
{
  "rules": {
    "rsvps": {
      ".read": false,
      ".write": true
    }
  }
}
```

This allows anyone to write (submit) RSVPs but only you (when authenticated) can read them.

4. Click "Publish"

## Step 7: View RSVP Responses

You have two options to view responses:

### Option A: Firebase Console (Easiest)
1. Go to Firebase Console → Realtime Database
2. Click on "Data" tab
3. Expand the "rsvps" node to see all responses

### Option B: Export to JSON
1. In the Realtime Database, click the three dots menu
2. Select "Export JSON"
3. This will download all RSVPs as a JSON file

### Option C: Create a Simple Admin Page (Advanced)
You can create a separate admin page that authenticates with Firebase and displays all RSVPs in a nice format. Let me know if you'd like help with this!

## Pricing

Firebase Realtime Database has a **free tier** that includes:
- 1 GB stored data
- 10 GB/month downloaded data
- 100 simultaneous connections

For a wedding with ~80 guests, this is more than sufficient and will cost $0.

## Troubleshooting

### RSVPs not appearing in Firebase
- Check browser console for errors (F12 → Console tab)
- Verify your Firebase config is correct in `script.js`
- Make sure the databaseURL is included in your config

### "Permission denied" errors
- Check your database rules allow `.write: true` for the rsvps path
- Verify you're using the correct project

### Firebase not loading
- Check your internet connection
- Verify the Firebase SDK scripts are loading (check Network tab in browser dev tools)

## Need Help?

If you run into any issues, feel free to ask for help! Include:
1. Any error messages from the browser console
2. What step you're stuck on
3. Screenshots if helpful
