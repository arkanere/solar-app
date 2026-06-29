// Pure helpers for the public "download sample quotation" feature.
// These produce an INDICATIVE reference quotation a visitor can keep / forward
// and use as a sanity check against real installer quotes. The numbers are
// intentionally generic (not city-specific) and the PDF is stamped SAMPLE.
//
// The pricing model mirrors the installer-facing Quotation Maker so the sample
// looks like the real thing: itemized BOM -> subtotal -> GST -> PM Surya Ghar
// subsidy -> net payable.

export type SampleLineItem = {
	description: string;
	qty: number;
	unit: string;
	amount: number; // line total, ex-GST (₹)
	warranty: string; // typical, brand-neutral warranty for this component
};

export type SampleTotals = {
	subtotal: number;
	gst: number;
	gross: number;
	subsidy: number;
	netPayable: number;
};

export type SampleQuotation = {
	kw: number;
	systemType: string;
	items: SampleLineItem[];
	totals: SampleTotals;
};

// Indicative ex-GST price per kW. Chosen so the GST-inclusive gross lands inside
// the cost ranges shown in the on-page subsidy table across 1–10 kW.
const RATE_PER_KW = 60000;
export const GST_RATE = 13.8;
const PANEL_WATTAGE = 545; // typical Mono PERC / N-Type module

// Share of the ex-GST subtotal for each standard rooftop BOM line. Sums to 1.
// Warranties are typical, brand-neutral ranges so the buyer learns what "normal"
// looks like — actual warranties vary by manufacturer and installer.
const BOM: { description: string; unit: string; share: number; perKw?: boolean; warranty: string }[] = [
	{ description: `Solar Panels (Mono PERC / N-Type, ${PANEL_WATTAGE}W)`, unit: 'Nos', share: 0.45, warranty: '25 yr perf.' },
	{ description: 'Solar Inverter (On-Grid)', unit: 'Nos', share: 0.15, warranty: '5–10 yr' },
	{ description: 'Module Mounting Structure', unit: 'kW', share: 0.1, perKw: true, warranty: '5–10 yr' },
	{ description: 'DC Cables & MC4 Connectors', unit: 'Lot', share: 0.03, warranty: '1 yr' },
	{ description: 'AC Cables', unit: 'Lot', share: 0.03, warranty: '1 yr' },
	{ description: 'ACDB & DCDB', unit: 'Set', share: 0.04, warranty: '1 yr' },
	{ description: 'Earthing Kit & Lightning Arrestor', unit: 'Set', share: 0.03, warranty: '1 yr' },
	{ description: 'Net Meter & Liaisoning / Net-Metering', unit: 'Lot', share: 0.05, warranty: '—' },
	{ description: 'Installation & Commissioning', unit: 'Lot', share: 0.08, warranty: '1 yr' },
	{ description: 'Transportation', unit: 'Lot', share: 0.04, warranty: '—' }
];

// PM Surya Ghar Muft Bijli Yojana central subsidy slabs:
// ₹30,000/kW up to 2 kW, ₹18,000 for the 3rd kW, capped at ₹78,000 for >=3 kW.
export const pmSuryaGharSubsidy = (kw: number): number => {
	const k = Number.isFinite(kw) ? kw : 0;
	if (k <= 0) return 0;
	if (k <= 2) return 30000 * k;
	if (k <= 3) return 60000 + 18000 * (k - 2);
	return 78000;
};

// jsPDF's built-in Helvetica lacks the ₹ glyph (U+20B9); use "Rs." in PDFs.
export const formatRs = (n: number): string =>
	'Rs. ' + Math.round(n).toLocaleString('en-IN');

export const formatINR = (n: number): string =>
	'₹' + Math.round(n).toLocaleString('en-IN');

// Parse a representative capacity from row labels like "1 kW" or "1 – 2 kW — Hybrid".
export const parseKw = (label: string): number => {
	const nums = (label.match(/\d+(?:\.\d+)?/g) || []).map(Number);
	if (nums.length === 0) return 0;
	const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
	return Math.round(avg * 2) / 2; // nearest 0.5 kW
};

export const buildSampleQuotation = (kw: number, systemType = 'On-Grid'): SampleQuotation => {
	const subtotal = kw * RATE_PER_KW;
	const panelCount = Math.max(1, Math.round((kw * 1000) / PANEL_WATTAGE));

	const items: SampleLineItem[] = BOM.map((line) => {
		const amount = subtotal * line.share;
		let qty = 1;
		if (line.unit === 'Nos' && line.description.startsWith('Solar Panels')) qty = panelCount;
		else if (line.perKw) qty = kw;
		return { description: line.description, qty, unit: line.unit, amount, warranty: line.warranty };
	});

	const gst = subtotal * (GST_RATE / 100);
	const gross = subtotal + gst;
	const subsidy = pmSuryaGharSubsidy(kw);

	return {
		kw,
		systemType,
		items,
		totals: { subtotal, gst, gross, subsidy, netPayable: gross - subsidy }
	};
};
