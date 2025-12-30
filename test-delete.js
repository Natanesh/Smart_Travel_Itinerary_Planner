/**
 * Quick test script to verify delete functionality
 * Run this after starting your backend server
 * Usage: node test-delete.js
 */

const http = require('http');

// First, get all itineraries to see what exists
function checkItineraries() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/debug/itineraries',
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result);
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

async function test() {
  console.log('🔍 Checking itineraries in database...\n');
  
  try {
    const result = await checkItineraries();
    console.log(`📊 Total itineraries found: ${result.count}`);
    console.log('\n📋 Itinerary List:');
    console.log('─'.repeat(80));
    
    if (result.itineraries && result.itineraries.length > 0) {
      result.itineraries.forEach((itinerary) => {
        console.log(`ID: ${itinerary.id} | User: ${itinerary.user_id} | Destination: ${itinerary.destination} | Budget: ₹${itinerary.budget}`);
      });
      console.log('─'.repeat(80));
      console.log('\n✅ Database connection working!');
      console.log('💡 To test delete:');
      console.log('   1. Start your frontend (npm start in frontend folder)');
      console.log('   2. Login and go to itinerary list');
      console.log('   3. Click delete on any itinerary');
      console.log('   4. Run this script again to verify it was deleted');
    } else {
      console.log('⚠️  No itineraries found in database');
      console.log('💡 Create some itineraries first, then test delete');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Make sure:');
    console.log('   - Backend server is running (port 3000)');
    console.log('   - Database is connected');
    console.log('   - Run: cd backend && npx ts-node src/server.ts');
  }
}

test();

