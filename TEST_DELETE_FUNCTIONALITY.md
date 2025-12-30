# Testing Delete Functionality

## Step-by-Step Testing Guide

### 1. Start the Backend Server
```bash
cd backend
npm install  # if not already done
npx ts-node src/server.ts
```
You should see: `Server running on port 3000` and `MySQL connected...`

### 2. Start the Frontend Server
```bash
cd frontend
npm install  # if not already done
npm start
```
The app should open at `http://localhost:4200`

### 3. Check Current Itineraries in Database
Before testing, check what itineraries exist:
- Open browser and go to: `http://localhost:3000/debug/itineraries`
- This will show all itineraries with their IDs
- Note down an ID you want to test deleting

### 4. Test Delete from List View
1. Login to your application
2. Navigate to the Itinerary List page
3. You should see:
   - Each itinerary showing "ID: [number]" 
   - A red "Delete" button for each itinerary
4. Click the "Delete" button on any itinerary
5. Confirm the deletion in the popup
6. The itinerary should disappear from the list immediately
7. Check the backend console - you should see logs like:
   ```
   [DELETE] Attempting to delete itinerary ID: X for user ID: Y
   [DELETE] Found itinerary: [destination] (ID: X)
   [DELETE] Successfully deleted itinerary ID: X. Affected rows: 1
   ```

### 5. Test Delete from Detail View
1. Click "View Details" on any itinerary
2. You should see the itinerary details page with "Itinerary Id: [number]"
3. Click the "Delete" button at the bottom
4. Confirm the deletion
5. You should be redirected to the itinerary list
6. Check backend console for delete logs

### 6. Verify Deletion in Database
After deleting, verify it's actually removed from database:
- Go to: `http://localhost:3000/debug/itineraries`
- The deleted itinerary should no longer appear in the list
- Count should be reduced by 1

### 7. Check Browser Console
Open browser DevTools (F12) and check:
- Network tab: Look for DELETE request to `/itineraries/[id]`
- Console tab: Check for any errors
- The response should be: `{ message: "Itinerary deleted successfully", deletedId: [id] }`

## Troubleshooting

### If delete doesn't work:
1. **Check backend console** - Look for error messages
2. **Check browser console** - Look for JavaScript errors
3. **Check network tab** - Verify the DELETE request is being sent
4. **Verify user is logged in** - The delete requires authentication (cookie)
5. **Check database connection** - Make sure MySQL is running

### Common Issues:
- **404 Error**: Itinerary not found or doesn't belong to user
- **500 Error**: Database connection issue or SQL error
- **No response**: Backend server might not be running

## Expected Behavior:
✅ Delete button appears for each itinerary
✅ ID is displayed next to destination
✅ Confirmation dialog appears before deletion
✅ Itinerary disappears from list after deletion
✅ Backend logs show successful deletion
✅ Database record is actually deleted
✅ Cannot delete other users' itineraries (security check)

