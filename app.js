//This was a side project I had made that was taking trips from a logistics board
//and loading them into a google spreadsheet. 
const {
	getAuthToken,
	getSpreadSheet,
	getSpreadSheetValues,
	setSpreadSheetValues
} = require('./googleSheetsService.js');
const {
	getTrips
} = require('XXX');

const spreadsheetId = "XXX";
const sheetName = 'Sheet1';
let trips = '';
let IDs = [];

async function testGetSpreadSheet() {
	try {
		const auth = await getAuthToken();
		const response = await getSpreadSheet({
			spreadsheetId,
			auth
		})
		console.log('output for getSpreadSheet', JSON.stringify(response.data, null, 2));
	}
	catch (error) {
		console.log(error.message, error.stack);
	}
}

async function testGetSpreadSheetValues() {
	try {
		const auth = await getAuthToken();
		const response = await getSpreadSheetValues({
			spreadsheetId,
			sheetName,
			auth
		})
		// console.log('output for getSpreadSheetValues', JSON.stringify(response.data, null, 2));
		return response.data;
	}
	catch (error) {
		console.log(error.message, error.stack);
	}
}

async function testSetSpreadSheetValues() {
	try {
		const auth = await getAuthToken();
		const response = await setSpreadSheetValues({
			spreadsheetId,
			auth,
			trips,
		})
		console.log(response.config.body);
	}
	catch (error) {
		console.log(error.message, error.stack);
	}
}


async function main() {
	IDs = await testGetSpreadSheetValues();
	let uniqueIDs = uniqueChars = [...new Set(IDs.values.flat())];
	const tripList = await getTrips();
	for (let i = 0; i < tripList.length; i++) {
		(function(trip) {
			if (!uniqueIDs.includes(trip.boltTripId))
				setTimeout(function() {
					trips = [trip.boltTripId, `${trip.puAddress}, ${trip.puCity}, ${trip.puState}`, trip.puZip, trip.dueTime, `${trip.doAddress}, ${trip.doCity}, ${trip.doState}`, trip.doZip, trip.serviceLevel, trip.payAmount, trip.tripMiles];
					testSetSpreadSheetValues()
				}, i * 500);
		})(tripList[i]);
	}

}
setInterval(function() {
	main()
}, 45000);