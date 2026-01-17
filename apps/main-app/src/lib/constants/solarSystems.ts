/**
 * Recommended Solar Systems data for homes
 * Maps consumption levels and power outage scenarios to system recommendations
 */
export const RECOMMENDED_SYSTEMS = [
	{
		consumption: '100 – 200 units / ₹500 – ₹1,500',
		outage: 'No outage',
		system: '1 – 2 kW — On-grid',
		note: 'no battery required; net metering'
	},
	{
		consumption: '100 – 200 units / ₹500 – ₹1,500',
		outage: '> 1 hour',
		system: '1.5 – 2.5 kW — Hybrid',
		note: 'battery 1–3 kWh for critical loads'
	},
	{
		consumption: '200 – 400 units / ₹1,500 – ₹3,000',
		outage: 'No outage',
		system: '2 – 3 kW — On-grid',
		note: ''
	},
	{
		consumption: '200 – 400 units / ₹1,500 – ₹3,000',
		outage: '> 1 hour',
		system: '3 – 4 kW — Hybrid',
		note: 'battery 3–6 kWh'
	},
	{
		consumption: '400 – 600 units / ₹3,000 – ₹5,000',
		outage: 'No outage',
		system: '3 – 5 kW — On-grid',
		note: ''
	},
	{
		consumption: '400 – 600 units / ₹3,000 – ₹5,000',
		outage: '> 1 hour',
		system: '4 – 6 kW — Hybrid',
		note: 'battery 6–10 kWh'
	}
];

export const INDIA_STATES = [
	'Andaman and Nicobar Islands',
	'Andhra Pradesh',
	'Arunachal Pradesh',
	'Assam',
	'Bihar',
	'Chandigarh',
	'Chhattisgarh',
	'Dadra and Nagar Haveli and Daman and Diu',
	'Delhi',
	'Goa',
	'Gujarat',
	'Haryana',
	'Himachal Pradesh',
	'Jammu and Kashmir',
	'Jharkhand',
	'Karnataka',
	'Kerala',
	'Ladakh',
	'Lakshadweep',
	'Madhya Pradesh',
	'Maharashtra',
	'Manipur',
	'Meghalaya',
	'Mizoram',
	'Nagaland',
	'Odisha',
	'Puducherry',
	'Punjab',
	'Rajasthan',
	'Sikkim',
	'Tamil Nadu',
	'Telangana',
	'Tripura',
	'Uttar Pradesh',
	'Uttarakhand',
	'West Bengal'
];
