// Pure helpers for the solar quotation maker (India / PM Surya Ghar).
// Kept side-effect free so pricing is easy to reason about and test.

export type LineItem = {
	description: string;
	qty: number | string;
	unit: string;
	rate: number | string;
};

const num = (v: number | string): number => {
	const n = typeof v === 'number' ? v : parseFloat(v);
	return Number.isFinite(n) ? n : 0;
};

// Standard Indian rooftop BOM. Rates left at 0 for the installer to fill in.
export const defaultLineItems = (): LineItem[] => [
	{ description: 'Solar Panels (Mono PERC / N-Type)', qty: 0, unit: 'Nos', rate: 0 },
	{ description: 'Solar Inverter (On-Grid)', qty: 1, unit: 'Nos', rate: 0 },
	{ description: 'Module Mounting Structure', qty: 0, unit: 'kW', rate: 0 },
	{ description: 'DC Cables & MC4 Connectors', qty: 1, unit: 'Lot', rate: 0 },
	{ description: 'AC Cables', qty: 1, unit: 'Lot', rate: 0 },
	{ description: 'ACDB & DCDB', qty: 1, unit: 'Set', rate: 0 },
	{ description: 'Earthing Kit & Lightning Arrestor', qty: 1, unit: 'Set', rate: 0 },
	{ description: 'Net Meter & Liaisoning / Net-Metering', qty: 1, unit: 'Lot', rate: 0 },
	{ description: 'Installation & Commissioning', qty: 1, unit: 'Lot', rate: 0 },
	{ description: 'Transportation', qty: 1, unit: 'Lot', rate: 0 }
];

export const lineTotal = (item: LineItem): number => num(item.qty) * num(item.rate);

export const subtotal = (items: LineItem[]): number =>
	items.reduce((sum, item) => sum + lineTotal(item), 0);

export const gstAmount = (sub: number, ratePct: number | string): number =>
	sub * (num(ratePct) / 100);

// PM Surya Ghar Muft Bijli Yojana central subsidy slabs.
// Rs.30,000/kW up to 2 kW, Rs.18,000 for the 3rd kW, capped at Rs.78,000 for >=3 kW.
export const pmSuryaGharSubsidy = (kw: number | string): number => {
	const k = num(kw);
	if (k <= 0) return 0;
	if (k <= 2) return 30000 * k;
	if (k <= 3) return 60000 + 18000 * (k - 2);
	return 78000;
};

export type QuotationTotals = {
	subtotal: number;
	gst: number;
	gross: number;
	subsidy: number;
	netPayable: number;
};

export const computeTotals = (
	items: LineItem[],
	gstRate: number | string,
	subsidy: number | string
): QuotationTotals => {
	const sub = subtotal(items);
	const gst = gstAmount(sub, gstRate);
	const gross = sub + gst;
	const sd = num(subsidy);
	return { subtotal: sub, gst, gross, subsidy: sd, netPayable: gross - sd };
};

export const formatINR = (n: number | string): string =>
	'₹' + Math.round(num(n)).toLocaleString('en-IN');

// jsPDF's built-in Helvetica lacks the ₹ glyph (U+20B9); use "Rs." in PDFs.
export const formatRs = (n: number | string): string =>
	'Rs. ' + Math.round(num(n)).toLocaleString('en-IN');
