# How to View and Manage RSVPs

## Viewing RSVPs in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your "weddingrsvp-3d7a2" project
3. Click **"Realtime Database"** in the left sidebar
4. Click the **"Data"** tab

You'll see all RSVPs organized like this:

```
rsvps
  ├─ -RandomID1
  │   ├─ timestamp: "2025-11-10T..."
  │   ├─ guest1
  │   │   ├─ id: 1
  │   │   ├─ name: "Jonathan Alverson"
  │   │   ├─ email: "alversonjonathan@gmail.com"
  │   │   ├─ events
  │   │   │   ├─ welcomeParty: true
  │   │   │   ├─ wedding: true
  │   │   │   └─ beach: false
  │   │   ├─ dietary: "Vegetarian"
  │   │   └─ notes: "Looking forward to it!"
  │   └─ guest2 (if couple RSVP'd together)
  │       └─ ...
  └─ -RandomID2
      └─ ...
```

## Exporting RSVPs

### Method 1: Export as JSON
1. In the Database view, click the **three dots menu (⋮)** at the top right
2. Select **"Export JSON"**
3. This downloads all your RSVPs as a .json file

### Method 2: Copy/Paste to Spreadsheet
1. Click on the "rsvps" node to expand it
2. For each RSVP, you can manually copy the data
3. Paste into Excel/Google Sheets

### Method 3: Use a Script (Advanced)
I can help you create a simple admin page that displays all RSVPs in a nice table format if you'd like!

## Understanding the Data Structure

Each RSVP contains:

**For Single Guests:**
- `timestamp` - When they RSVP'd
- `guest1.id` - Guest ID from your guest list
- `guest1.name` - Full name
- `guest1.email` - Email address
- `guest1.events.welcomeParty` - true/false
- `guest1.events.wedding` - true/false
- `guest1.events.beach` - true/false
- `guest1.dietary` - Dietary restrictions text
- `guest1.notes` - Special notes/comments

**For Couple RSVPs:**
Same as above, but includes `guest2` with the same structure.

## Deleting Test RSVPs

To delete a test RSVP:
1. In the Database Data tab, find the test RSVP
2. Hover over the entry (the `-RandomID` line)
3. Click the **X** that appears on the right
4. Confirm deletion

## Getting RSVP Count Summary

To quickly see how many guests are attending each event:
1. Export the JSON file
2. Open it in a text editor
3. Search for:
   - `"welcomeParty": true` - count the results
   - `"wedding": true` - count the results
   - `"beach": true` - count the results

Or I can help you create a simple dashboard that shows these counts automatically!

## Monitoring RSVPs in Real-Time

The Firebase Console updates in real-time, so you can:
1. Keep the Database tab open
2. When someone submits an RSVP, it appears immediately
3. No need to refresh the page!

## Security Note

With your current rules:
- ✅ Only you can view RSVPs (through Firebase Console)
- ✅ Guests can submit RSVPs
- ✅ Guests CANNOT view other people's RSVPs
- ✅ Guests CANNOT edit or delete RSVPs

## Questions?

Common questions:
- **Can guests change their RSVP?** Not currently, but I can add an "edit RSVP" feature if you want
- **Will I get notified when someone RSVPs?** Not automatically, but I can set up email notifications if you'd like
- **Can I download this as Excel?** Export as JSON, then use an online JSON-to-Excel converter, or I can help you build an export feature

Let me know if you need help with anything!
