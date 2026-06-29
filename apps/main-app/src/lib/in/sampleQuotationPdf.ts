// Client-side generator for the public "sample quotation" PDF.
// jsPDF is imported dynamically so it never lands in the initial page bundle —
// it only loads when a visitor actually clicks "Download sample quotation".

import {
	buildSampleQuotation,
	formatRs,
	GST_RATE,
	type SampleLineItem
} from '$lib/in/sampleQuotation';

export type SampleQuotationOptions = {
	kw: number;
	systemType?: string;
	city?: string;
	/** Canonical page URL to link back to. Falls back to the live URL if omitted. */
	pageUrl?: string;
};

// Load a static asset as a data URL so jsPDF can embed it. Returns null on any
// failure so a missing/broken logo never blocks the download.
async function loadImageDataUrl(url: string): Promise<string | null> {
	try {
		const res = await fetch(url);
		if (!res.ok) return null;
		const blob = await res.blob();
		return await new Promise((resolve) => {
			const fr = new FileReader();
			fr.onload = () => resolve(typeof fr.result === 'string' ? fr.result : null);
			fr.onerror = () => resolve(null);
			fr.readAsDataURL(blob);
		});
	} catch {
		return null;
	}
}

export async function generateSampleQuotationPdf(opts: SampleQuotationOptions): Promise<void> {
	const { kw, systemType = 'On-Grid', city } = opts;
	const { jsPDF } = await import('jspdf');

	const q = buildSampleQuotation(kw, systemType);
	const place = city?.trim() ? city.trim() : 'your area';
	const pageUrl =
		opts.pageUrl?.trim() ||
		(typeof window !== 'undefined' ? window.location.href : 'https://solarvipani.com');
	const logo = await loadImageDataUrl('/logo512.png');

	const doc = new jsPDF();
	const pageW = doc.internal.pageSize.getWidth();
	const pageH = doc.internal.pageSize.getHeight();
	const margin = 14;
	const right = pageW - margin;
	let y = 18;

	const accent: [number, number, number] = [0, 86, 179];

	// Diagonal SAMPLE watermark so this can never be mistaken for a real offer.
	doc.setTextColor(235, 235, 235);
	doc.setFontSize(90);
	doc.setFont('helvetica', 'bold');
	doc.text('SAMPLE', pageW / 2, pageH / 2, { align: 'center', angle: 35 });

	// Header — logo (if available) + brand name, text vertically centred on the logo
	const logoSize = 36;
	const logoTop = 4;
	let textX = margin;
	let brandY = y; // default baseline when no logo
	if (logo) {
		doc.addImage(logo, 'PNG', margin, logoTop, logoSize, logoSize);
		textX = margin + logoSize + 5;
		brandY = logoTop + logoSize / 2 - 1; // centre the two-line block on the logo
	}
	doc.setFontSize(18);
	doc.setTextColor(...accent);
	doc.setFont('helvetica', 'bold');
	doc.text('Solar Vipani', textX, brandY);
	doc.setFontSize(15);
	doc.setTextColor(120, 120, 120);
	doc.text('SAMPLE QUOTATION', right, brandY, { align: 'right' });
	doc.setFont('helvetica', 'normal');
	doc.setFontSize(9);
	doc.setTextColor(90, 90, 90);
	doc.text('solarvipani.com  |  Indicative reference — not a real offer', textX, brandY + 6);
	y = Math.max(brandY + 12, logoTop + logoSize + 5); // clear the logo before the divider
	doc.setDrawColor(...accent);
	doc.setLineWidth(0.5);
	doc.line(margin, y, right, y);
	y += 8;

	// Disclaimer banner
	doc.setFillColor(255, 247, 230);
	doc.rect(margin, y - 4, right - margin, 14, 'F');
	doc.setTextColor(150, 90, 0);
	doc.setFontSize(8.5);
	const disclaimer =
		'This is an INDICATIVE sample to help you understand a typical solar quotation. ' +
		'Actual prices vary by roof, brand, and installer. Use it as a reference when comparing real quotes.';
	doc.text(doc.splitTextToSize(disclaimer, right - margin - 4), margin + 2, y + 1);
	y += 16;

	// System summary
	doc.setTextColor(0, 0, 0);
	doc.setFontSize(10);
	doc.setFont('helvetica', 'bold');
	doc.text('System', margin, y);
	doc.setFont('helvetica', 'normal');
	doc.text(
		`${q.kw} kW ${q.systemType} rooftop solar  |  Location: ${place}  |  ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}`,
		margin + 22,
		y
	);
	y += 8;

	// BOM table header
	const cols = { sno: margin, desc: margin + 7, warr: 108, qty: 142, unit: 148, amt: right };
	doc.setFillColor(...accent);
	doc.setTextColor(255, 255, 255);
	doc.setFontSize(9);
	doc.setFont('helvetica', 'bold');
	doc.rect(margin, y - 4, right - margin, 7, 'F');
	doc.text('#', cols.sno + 1, y);
	doc.text('Description', cols.desc, y);
	doc.text('Warranty', cols.warr, y);
	doc.text('Qty', cols.qty, y, { align: 'right' });
	doc.text('Unit', cols.unit, y);
	doc.text('Amount', cols.amt, y, { align: 'right' });
	y += 7;

	doc.setFont('helvetica', 'normal');
	doc.setTextColor(0, 0, 0);
	let sno = 1;
	for (const item of q.items as SampleLineItem[]) {
		const descLines = doc.splitTextToSize(item.description, 78);
		const rowH = Math.max(6, descLines.length * 5);
		doc.text(String(sno), cols.sno + 1, y);
		doc.text(descLines, cols.desc, y);
		doc.text(item.warranty, cols.warr, y);
		doc.text(String(item.qty), cols.qty, y, { align: 'right' });
		doc.text(item.unit, cols.unit, y);
		doc.text(formatRs(item.amount), cols.amt, y, { align: 'right' });
		doc.setDrawColor(225, 225, 225);
		doc.setLineWidth(0.1);
		doc.line(margin, y + rowH - 4, right, y + rowH - 4);
		y += rowH;
		sno++;
	}
	y += 4;

	// Totals
	const labelX = pageW - 98;
	const drawTotal = (label: string, value: string, bold = false) => {
		doc.setFont('helvetica', bold ? 'bold' : 'normal');
		doc.setFontSize(bold ? 11 : 10);
		doc.text(label, labelX, y);
		doc.text(value, right, y, { align: 'right' });
		y += bold ? 8 : 6;
	};
	drawTotal('Subtotal', formatRs(q.totals.subtotal));
	drawTotal(`GST (${GST_RATE}%)`, formatRs(q.totals.gst));
	drawTotal('Gross Total', formatRs(q.totals.gross));
	if (q.totals.subsidy > 0) drawTotal('Less: PM Surya Ghar Subsidy', `- ${formatRs(q.totals.subsidy)}`);
	doc.setDrawColor(...accent);
	doc.setLineWidth(0.4);
	doc.line(labelX, y - 4, right, y - 4);
	y += 2;
	drawTotal('Net Payable (after subsidy)', formatRs(q.totals.netPayable), true);
	y += 4;

	// Good-to-know notes (left column, beside/under the totals)
	const roofSqft = Math.round(q.kw * 80);
	const notes = [
		`Roof area needed: ~80 sqft/kW of shadow-free space — about ${roofSqft.toLocaleString('en-IN')} sqft for this ${q.kw} kW system.`,
		'Net metering is subject to DISCOM approval and sanctioned-load eligibility in your area.'
	];
	doc.setFont('helvetica', 'normal');
	doc.setFontSize(8.5);
	doc.setTextColor(90, 90, 90);
	for (const n of notes) {
		const lines = doc.splitTextToSize('•  ' + n, right - margin);
		doc.text(lines, margin, y);
		y += lines.length * 4.5;
	}
	y += 4;

	// Educational checklist — the real value the visitor carries into negotiations.
	if (y > pageH - 70) {
		doc.addPage();
		y = 20;
	}
	doc.setFont('helvetica', 'bold');
	doc.setFontSize(10);
	doc.setTextColor(...accent);
	doc.text('What to check when comparing real quotes', margin, y);
	y += 6;
	doc.setFont('helvetica', 'normal');
	doc.setFontSize(9);
	doc.setTextColor(60, 60, 60);
	const tips = [
		'Is the installer DISCOM-empanelled? (required to claim the PM Surya Ghar subsidy)',
		'Are panel brand, wattage, and inverter make/model written down?',
		'Is GST shown separately, and is the subsidy applied to the correct slab?',
		'Does the price include mounting structure, net-metering, and liaisoning?',
		'What is the workmanship warranty, and who handles service after install?'
	];
	for (const t of tips) {
		const lines = doc.splitTextToSize('•  ' + t, right - margin);
		doc.text(lines, margin, y);
		y += lines.length * 5;
	}
	y += 4;

	// Footer CTA — clickable, links back to this exact page
	doc.setDrawColor(...accent);
	doc.setLineWidth(0.4);
	doc.line(margin, pageH - 22, right, pageH - 22);

	const cta = `Get free online solar quotes from 2-3 local verified installers in ${place}`;
	doc.setFont('helvetica', 'bold');
	doc.setFontSize(9);
	doc.setTextColor(...accent);
	doc.textWithLink(cta, (pageW - doc.getTextWidth(cta)) / 2, pageH - 16, { url: pageUrl });

	doc.setFont('helvetica', 'normal');
	doc.setFontSize(8.5);
	doc.textWithLink(pageUrl, (pageW - doc.getTextWidth(pageUrl)) / 2, pageH - 11, { url: pageUrl });

	doc.setFontSize(7.5);
	doc.setTextColor(140, 140, 140);
	doc.text('Indicative sample generated by Solar Vipani. Not a binding offer.', pageW / 2, pageH - 6, {
		align: 'center'
	});

	doc.save(`solar-vipani-sample-quotation-${q.kw}kw.pdf`);
}
